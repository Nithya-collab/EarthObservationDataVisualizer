# main.py
from fastapi import FastAPI
import psycopg2
import geojson
import database

app = FastAPI()

# Add API endpoint to fetch data as GeoJSON
@app.get("/api/data/geojson")
def get_geojson_data():
    
    # Try to connect to the database
    try:
        connection = database.get_db_connection("postgres", "postgres", "yourstrongpassword", "127.0.0.1", "5432")
        # You can execute a query here if needed
        # Don't forget to close the connection after use
        connection.close()
        return {"message": "Connection to the database successful!"}
    except Exception as e:
        return {"error": str(e)}
    # Example: conn = psycopg2.connect("dbname=postgres user=postgres password=yourstrongpassword host=localhost port=5432")
    # Query the database using ST_AsGeoJSON function
    # Return the GeoJSON object

    return {"message": "Endpoint configured, implement DB logic here."}