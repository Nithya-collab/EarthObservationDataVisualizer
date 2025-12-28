
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "test_kare",
    port: parseInt(process.env.DB_PORT || "5432"),
});

async function checkSchema() {
    try {
        const res = await pool.query("SELECT * FROM india_airlines LIMIT 1");
        console.log("Columns:", Object.keys(res.rows[0]));
        // console.log("Sample row:", res.rows[0]); 
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkSchema();
