# tests/test_models.py
import pytest
from geoalchemy2 import WKBElement, WKTElement
from shapely import wkb
from shapely.geometry import Point
from sqlalchemy import Column, Integer, String
from geoalchemy2 import Geometry
# !!! IMPORT 'Base' from the configuration file where it is instantiated !!!
from tests.conftest import Base 

# --- Test Definitions ---

def test_point_model_definition():
    """
    Test that we can define a basic SQLAlchemy model with a PostGIS geometry column.
    """
    try:
        class Place(Base):
            __tablename__ = 'places'
            id = Column(Integer, primary_key=True)
            name = Column(String(50))
            # SRID 4326 is standard WGS84 latitude/longitude
            geom = Column(Geometry('POINT', srid=4326)) 

        assert Place.__tablename__ == 'places'
        # Check if the 'geom' column is correctly identified as a Geometry type
        assert str(Place.geom.type) == 'geometry(POINT,4326)' 
        assert Place.geom.type.srid == 4326
        print("\nModel definition works as expected.")

    except Exception as e:
        pytest.fail(f"Could not define Place model with GeoAlchemy2: {e}")


def test_insert_and_retrieve_spatial_data(db_session):
    """
    Test inserting a record with a spatial point and retrieving it, 
    verifying it returns a GeoAlchemy2 object.
    """
    from map_viz.models import Place # We will create this file later

    # Create a WKTElement for insertion
    p = WKTElement('POINT(-122.330082 47.603832)', srid=4326) # Seattle downtown coordinates

    new_place = Place(name='Seattle', geom=p)
    db_session.add(new_place)
    db_session.commit()

    # Retrieve the object from the database
    retrieved_place = db_session.query(Place).filter_by(name='Seattle').first()

    assert retrieved_place is not None
    assert isinstance(retrieved_place.geom, WKBElement) # Data is returned as WKB
    assert retrieved_place.geom.srid == 4326
    
    # Use shapely for easy comparison of coordinates
    shapely_geom = wkb.loads(bytes(retrieved_place.geom.data))
    assert isinstance(shapely_geom, Point)
    assert shapely_geom.x == pytest.approx(-122.330082)
    assert shapely_geom.y == pytest.approx(47.603832)
    print("\nSuccessfully inserted and retrieved spatial data.")

def test_spatial_query_ST_Within(db_session):
    """
    Test performing a spatial query using GeoAlchemy2's functions (e.g., ST_Within).
    """
    from map_viz.models import Place
    from geoalchemy2.functions import ST_Within
    from sqlalchemy import func

    # Insert a place
    p = WKTElement('POINT(5 5)', srid=4326)
    db_session.add(Place(name='Center', geom=p))
    db_session.commit()

    # Define a bounding box/polygon as WKT
    # Polygon covering area from (0,0) to (10,10)
    bbox = WKTElement('POLYGON((0 0, 0 10, 10 10, 10 0, 0 0))', srid=4326)

    # Perform the spatial query using ST_Within function
    # func.count('*') counts how many records satisfy the condition
    count = db_session.query(func.count('*')).filter(
        ST_Within(Place.geom, bbox)
    ).scalar()

    assert count == 1, "The point at (5,5) should be within the (0,0)-(10,10) polygon."
    print("\nSpatial query ST_Within works as expected.")
