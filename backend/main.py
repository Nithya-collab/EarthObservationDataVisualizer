from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os

app = FastAPI()

# Enable CORS (same as app.use(cors()))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL connection details (same as Node.js env variables)
DB_CONFIG = {
    "host": os.getenv("POSTGRES_HOST", "host.docker.internal"),
    "port": os.getenv("POSTGRES_PORT", 5432),
    "user": os.getenv("POSTGRES_USER", "postgres"),
    "password": os.getenv("POSTGRES_PASSWORD", "1234"),
    "database": os.getenv("POSTGRES_DB", "test_kare"),
}


@app.get("/locations")
def get_locations():
    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        # Same query you used in Node.js
        cur.execute("SELECT x, y FROM imported_features LIMIT 100")
        rows = cur.fetchall()

        # Convert to GeoJSON format
        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [float(row[0]), float(row[1])]
                    },
                    "properties": {}
                }
                for row in rows
            ]
        }

        cur.close()
        conn.close()

        return geojson

    except Exception as e:
        print("Error:", e)
        return {"error": "Server error"}, 500
