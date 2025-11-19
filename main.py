# main.py
from fastapi import FastAPI
import psycopg2
import geojson

app = FastAPI()

# Add API endpoint to fetch data as GeoJSON
@app.get("/api/data/geojson")
def get_geojson_data():
    # Connect to your PostGIS DB, run query, fetch results
    # Example: conn = psycopg2.connect("dbname=postgres user=postgres password=yourstrongpassword host=localhost port=5432")
    # Query the database using ST_AsGeoJSON function
    # Return the GeoJSON object
    return {"message": "Endpoint configured, implement DB logic here."}