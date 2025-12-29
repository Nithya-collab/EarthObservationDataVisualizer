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

// Endpoint to get India State Borders
app.get("/states", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ST_AsGeoJSON(wkb_geometry) AS geometry, name_1 AS state_name
      FROM india_state_border
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry),
        properties: {
          state: row.state_name
        }
      }))
    };
    res.json(geojson);
  } catch (err) {
    console.error("STATES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Endpoint to get District-wise Population
app.get("/population", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        district,
        population,
        population_density,
        area_km2,
        ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geometry
      FROM district_wise_population
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry),
        properties: {
          district: row.district,
          population: row.population,
          density: row.population_density,
          area: row.area_km2
        }
      }))
    };
    res.json(geojson);
  } catch (err) {
    console.error("POPULATION ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to get Hospitals
// app.get("/hospitals", async (req, res) => {
//   try {
//     let { minLng, minLat, maxLng, maxLat } = req.query;

//     let query = `
//       SELECT
//         hospital_name,
//         hospital_category,
//         hospital_care_type,
//         state,
//         district,
//         pincode,
//         ST_AsGeoJSON(wkb_geometry) AS geometry
//       FROM india_hospitals
//     `;

//     let params = [];

//     // Optional: Use bounding box if provided
//     if (minLng && minLat && maxLng && maxLat) {
//       // Convert to numbers
//       minLng = parseFloat(minLng);
//       minLat = parseFloat(minLat);
//       maxLng = parseFloat(maxLng);
//       maxLat = parseFloat(maxLat);

//       if (![minLng, minLat, maxLng, maxLat].some(v => Number.isNaN(v))) {
//         query += ` WHERE wkb_geometry && ST_MakeEnvelope($1, $2, $3, $4, 4326)`;
//         params = [minLng, minLat, maxLng, maxLat];
//       }
//     }

//     const result = await pool.query(query, params);

//     const geojson = {
//       type: "FeatureCollection",
//       features: result.rows.map(row => ({
//         type: "Feature",
//         geometry: JSON.parse(row.geometry),
//         properties: {
//           name: row.hospital_name,
//           category: row.hospital_category,
//           care_type: row.hospital_care_type,
//           state: row.state,
//           district: row.district,
//           pincode: row.pincode
//         }
//       }))
//     };
//     res.json(geojson);
//   } catch (err) {
//     console.error("HOSPITALS ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });




app.get("/hospitals", async (req, res) => {
  try {
    let { minLng, minLat, maxLng, maxLat } = req.query;

    console.log("Fetching hospitals with bounds:", { minLng, minLat, maxLng, maxLat });

    let query = `
      SELECT
        hospital_name,
        hospital_category,
        hospital_care_type,
        state,
        district,
        pincode,
        ST_AsGeoJSON(wkb_geometry) AS geometry
      FROM india_hospitals
    `;

    let params = [];

    // Parse and validate bounds
    const bounds = [minLng, minLat, maxLng, maxLat].map(Number);
    const hasValidBounds = bounds.every(v => !isNaN(v));

    if (hasValidBounds) {
      query += ` WHERE wkb_geometry && ST_MakeEnvelope($1, $2, $3, $4, 4326)`;
      params = bounds;
    } else {
      query += ` LIMIT 5000`; // Safety limit if no bounds provided
    }

    const result = await pool.query(query, params);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry),
        properties: {
          Hospital_Name: row.hospital_name,
          Hospital_Category: row.hospital_category,
          Hospital_Care_Type: row.hospital_care_type,
          State: row.state,
          District: row.district,
          Pincode: row.pincode
        }
      }))
    };

    console.log(`Returned ${geojson.features.length} hospitals`);
    res.json(geojson);
  } catch (err) {
    console.error("HOSPITALS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});






// Endpoint to get Rivers
app.get("/rivers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        rivname,
        origin,
        ST_AsGeoJSON(wkb_geometry) AS geometry
      FROM india_rivers
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry),
        properties: {
          River_Name: row.rivname,
          Origin: row.origin
        }
      }))
    };
    res.json(geojson);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to get Airlines
app.get("/airlines", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        name,
        type,
        state,
        district,
        ST_AsGeoJSON(wkb_geometry) AS geometry
      FROM india_airlines
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry),
        properties: {
          Name: row.name,
          Type: row.type,
          State: row.state,
          District: row.district
        }
      }))
    };
    res.json(geojson);
  } catch (err) {
    console.error("AIRLINES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Endpoint to get Railways
app.get("/railways", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        name,
        railway,
        ST_AsGeoJSON(wkb_geometry) AS geometry
      FROM india_railways
      LIMIT 5000
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry),
        properties: {
          Name: row.name,
          Type: row.railway
        }
      }))
    };
    res.json(geojson);
  } catch (err) {
    console.error("RAILWAYS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to get Roads
app.get("/roads", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        name,
        highway,
        surface,
        ST_AsGeoJSON(wkb_geometry) AS geometry
      FROM india_roads
      LIMIT 5000
    `);

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map(row => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry),
        properties: {
          Name: row.name,
          Type: row.highway,
          Surface: row.surface
        }
      }))
    };
    res.json(geojson);
  } catch (err) {
    console.error("ROADS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));