# EarthObservationDataVisualizer

Map-based analysis tool using ISRO Bhuvan datasets, FastAPI, Leaflet, and PostGIS

## Overview

This project is an interactive Earth Observation dashboard that visualizes real-world geospatial data such as:

Flood zones

Forest fire hotspots

Population density

District & state boundaries

The system uses ISRO’s Bhuvan open datasets and other source processes them with PostGIS, serves them via a FastAPI backend, and displays them using Leaflet.js on the frontend.


# Project Features
## Filters

Flood / Forest Fire / Population checkboxes

Date range slider

City / District search

Layer toggle controls

Full-screen dynamic map

## Data Visualization

GeoJSON polygons

Fire alert points

Heatmaps

District boundaries

Region-based queries

## Source: ISRO Bhuvan Data

Flood hazard maps

Forest fire alerts

LULC datasets

Administrative boundaries

 # Tech Stack
 ## Frontend (Map UI)

Leaflet.js – Interactive maps

HTML / CSS / JavaScript – UI

Axios – API requests

 ## Backend (API Service)

FastAPI – Fast Python API framework

psycopg2 / asyncpg – PostgreSQL connector

GeoJSON output – Map-ready responses

Possible future upgrade:

SQLAlchemy (ORM)

Pydantic (data validation)

## Database

PostgreSQL – relational storage

PostGIS – geospatial extension

Stores polygons, points, lines

Enables spatial queries

Converts shapes → GeoJSON

## GIS Tools

Bhuvan (ISRO) – official open Earth data

QGIS – inspecting datasets  (Bhuvan data → QGIS → PostGIS → FastAPI → Leaflet)

ogr2ogr – converting SHP ↔ GeoJSON

shp2pgsql – importing shapefiles into PostGIS

# Project Structure
<pre>
 ```
 earth-visualizer/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── routes/
│   ├── geo/
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── js/map.js
│   └── css/styles.css
│
├── data/
│   ├── floods/
│   ├── fires/
│   └── boundaries/
│    ..............
└── README.md
 
 ```
</pre>

## Run the Backend
uvicorn main:app --reload
Backend API will be available at: <u>http://localhost:8000</u>

## Run the Frontend
frontend/index.html

# Future Improvements

Add SQLAlchemy (ORM)

Add Pydantic models

Add JWT authentication

AI-based flood prediction

Time-series satellite data viewer




