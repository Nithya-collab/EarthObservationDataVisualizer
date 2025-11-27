from sqlalchemy import Column, Integer, String
from geoalchemy2 import Geometry
from map_viz.database import Base

class Place(Base):
    """
    A model to store locations with spatial data using PostGIS/GeoAlchemy2.
    """
    __tablename__ = 'places'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    # Define a Geometry column: POINT type, SRID 4326 (WGS84 lat/lon)
    geom = Column(Geometry(geometry_type='POINT', srid=4326))

    def __repr__(self):
        return f"<Place(name='{self.name}', geom='{self.geom}')>"
