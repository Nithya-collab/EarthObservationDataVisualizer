import test from 'node:test';
import assert from 'node:assert';
import pg from 'pg';
const { Client } = pg;

// Connection parameters (equivalent to your pytest fixture)
const dbConfig = {
  database: 'test_kare',
  user: 'postgres',
  password: '1234', // !! REPLACE THIS
  host: 'localhost',
  port: 5432,
};

test('successful database connection', async () => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    assert.ok(client, 'Client should be initialized');
    // Check if the connection is active
    const res = await client.query('SELECT NOW()');
    assert.strictEqual(res.rowCount, 1);
    console.log('\nSuccessfully connected to DB within test.');
  } finally {
    await client.end();
  }
});

test('failed database connection with bad credentials', async () => {
  const badConfig = { ...dbConfig, user: 'baduser', password: 'badpassword' };
  const client = new Client(badConfig);
  
  // In Node.js, we assert that the promise rejects
  await assert.rejects(
    async () => {
      await client.connect();
    },
    {
      name: 'Error', // You can be more specific depending on the pg error code
    },
    'Should throw an error with bad credentials'
  );
  
  // Ensure the client attempts to close if it partially opened
  await client.end().catch(() => {}); 
});

test('postgis extension is installed', async () => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'postgis'
      );
    `;
    const res = await client.query(query);
    const isInstalled = res.rows[0].exists;

    assert.strictEqual(isInstalled, true, 'PostGIS extension is not installed in the database!');
  } finally {
    await client.end();
  }
});
