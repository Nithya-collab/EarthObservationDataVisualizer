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

// const pool = new Pool({
//   host: process.env.POSTGRES_HOST,   // ← THIS will be "db"
//   port: process.env.POSTGRES_PORT,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB
// });


// Endpoint to get GeoJSON
// app.get("/locations", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT x, y FROM imported_features LIMIT 100"); // adjust if needed
//     const geojson = {
//       type: "FeatureCollection",
//       features: result.rows.map(row => ({
//         type: "Feature",
//         geometry: {
//           type: "Point",
//           coordinates: [parseFloat(row.x), parseFloat(row.y)]
//         },
//         properties: {}
//       }))
//     };
//     res.json(geojson);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });



// app.get("/locations", async (req, res) => {
//   const result = await pool.query("SELECT x, y FROM imported_features");
//   // const result = await pool.query("SELECT x, y FROM kat");
//   const geojson = {
//     type: "FeatureCollection",
//     features: result.rows.map(row => ({
//       type: "Feature",
//       geometry: {
//         type: "Point",
//         coordinates: [parseFloat(row.x), parseFloat(row.y)],
//       },
//       properties: {},
//     })),
//   };

//   res.json(geojson);
// });

app.get("/locations", async (req, res) => {
  // const result = await pool.query(`
  //   SELECT id, ST_AsGeoJSON(geom) as geometry, district, taluk, area
  //   FROM kat
  //   LIMIT 100
  // `);
  const { minLng, minLat, maxLng, maxLat } = req.query;
  const result = await pool.query(`
    SELECT
  id,
  ST_AsGeoJSON(
    ST_SimplifyPreserveTopology(geom, 0.01)
  ) AS geometry,
  district,
  taluk,
  area
FROM kat
WHERE ST_Intersects(
  geom,
  ST_MakeEnvelope($1, $2, $3, $4, 4326)
)`, [minLng, minLat, maxLng, maxLat]);
 
  // convert rows into GeoJSON FeatureCollection
  const features = result.rows.map(row => ({
    type: "Feature",
    geometry: JSON.parse(row.geometry),
    properties: {
      id: row.id,
      district: row.district,
      taluk: row.taluk,
      area: row.area
    }
  }));

  res.json({ type: "FeatureCollection", features });
});


module.exports = pool;
app.listen(5000, () => console.log("Server running on port 5000"));