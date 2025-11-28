const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "test_kare",
  port: 5432,
});

// Endpoint to get GeoJSON
app.get("/locations", async (req, res) => {
  try {
    const result = await pool.query("SELECT x, y FROM imported_features LIMIT 100"); // adjust if needed
    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(row.x), parseFloat(row.y)]
        },
        properties: {}
      }))
    };
    res.json(geojson);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));