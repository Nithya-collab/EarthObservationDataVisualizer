import { Pool } from 'pg';
import 'dotenv/config';

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "test_kare",
    port: parseInt(process.env.DB_PORT || "5432"),
};

const pool = new Pool(dbConfig);

async function test() {
    try {
        const res = await pool.query(`
      SELECT
        district,
        population,
        population_density,
        area_km2,
        ST_AsGeoJSON(geom) AS geometry
      FROM district_wise_population
      LIMIT 1
    `);
        console.log("Count:", res.rowCount);
        if (res.rowCount > 0) {
            console.log("Row 0:", JSON.stringify(res.rows[0], null, 2));
        } else {
            console.log("No rows found.");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

test();
