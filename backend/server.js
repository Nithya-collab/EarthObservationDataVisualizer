import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import 'dotenv/config'; // Loads variables from .env

const app = express();
app.use(cors());

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "test_kare",
  port: parseInt(process.env.DB_PORT || "5432"),
};

const pool = new Pool(dbConfig);

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

// app.get("/locations", async (req, res) => {
//   const { minLng, minLat, maxLng, maxLat } = req.query;
//   const result = await pool.query(`
//     SELECT
//   id,
//   ST_AsGeoJSON(
//     ST_SimplifyPreserveTopology(geom, 0.01)
//   ) AS geometry,
//   district,
//   taluk,
//   area
// FROM kat
// WHERE ST_Intersects(
//   geom,
//   ST_MakeEnvelope($1, $2, $3, $4, 4326)
// )`, [minLng, minLat, maxLng, maxLat]);
 
//   // convert rows into GeoJSON FeatureCollection
//   const features = result.rows.map(row => ({
//     type: "Feature",
//     geometry: JSON.parse(row.geometry),
//     properties: {
//       id: row.id,
//       district: row.district,
//       taluk: row.taluk,
//       area: row.area
//     }
//   }));

//   res.json({ type: "FeatureCollection", features });
// });


// app.get("/locations", async (req, res) => {
//   try {
//     const { minLng, minLat, maxLng, maxLat } = req.query;

//     // const result = await pool.query(
//     //   `
//     //   SELECT
//     //     ogc_fid,
//     //     villagenameenglish,
//     //     districtnameenglish,
//     //     statenameenglish,
//     //     ST_AsGeoJSON(wkb_geometry) AS geometry
//     //   FROM india_villages
//     //   WHERE ST_Intersects(
//     //     wkb_geometry,
//     //     ST_MakeEnvelope($1, $2, $3, $4, 4326)
//     //   )
//     //   LIMIT 5000
//     //   `,
//     //   [minLng, minLat, maxLng, maxLat]
//     // );


//     const result = await pool.query(
//   `
//   SELECT
//     ogc_fid,
//     villagenameenglish,
//     districtnameenglish,
//     statenameenglish,
//     ST_AsGeoJSON(geom) AS geometry
//   FROM india_villages
//   WHERE geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)
//     AND ST_Intersects(
//       geom,
//       ST_MakeEnvelope($1, $2, $3, $4, 4326)
//     )
//   LIMIT 5000
//   `,
//   [minLng, minLat, maxLng, maxLat]
// );


//     const geojson = {
//       type: "FeatureCollection",
//       features: result.rows.map(row => ({
//         type: "Feature",
//         geometry: JSON.parse(row.geometry),
//         properties: {
//           id: row.ogc_fid,
//           village: row.villagenameenglish,
//           district: row.districtnameenglish,
//           state: row.statenameenglish
//         }
//       }))
//     };

//     res.json(geojson);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });






app.get("/locations", async (req, res) => {
  try {
    let { minLng, minLat, maxLng, maxLat } = req.query;

    // Convert to numbers
    minLng = parseFloat(minLng);
    minLat = parseFloat(minLat);
    maxLng = parseFloat(maxLng);
    maxLat = parseFloat(maxLat);

    // Validate
    if (
      [minLng, minLat, maxLng, maxLat].some(v => Number.isNaN(v))
    ) {
      return res.status(400).json({ error: "Invalid bounding box" });
    }

    const result = await pool.query(
  `
  SELECT
    villagenameenglish,
    districtnameenglish,
    statenameenglish,
    ST_AsGeoJSON(geom) AS geometry
  FROM india_villages
  WHERE geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)
    AND ST_Intersects(
      geom,
      ST_MakeEnvelope($1, $2, $3, $4, 4326)
    )
  LIMIT 5000
  `,
  [minLng, minLat, maxLng, maxLat]
);


    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry),
        properties: {
          id: row.ogc_fid,
          village: row.villagenameenglish,
          district: row.districtnameenglish,
          state: row.statenameenglish
        }
      }))
    };

    res.json(geojson);
  } catch (err) {
    console.error("LOCATIONS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));