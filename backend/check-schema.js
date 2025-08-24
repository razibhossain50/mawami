const { Client } = require('pg');

async function checkSchema() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '12345',
    database: process.env.DB_NAME || 'Finder',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check user table schema
    const schemaResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Current user table schema:');
    console.table(schemaResult.rows);

    // Check if there are any existing users
    const userCount = await client.query('SELECT COUNT(*) FROM "user"');
    console.log(`\nTotal users in database: ${userCount.rows[0].count}`);

    // Show sample users
    const sampleUsers = await client.query('SELECT id, "fullName", email, role FROM "user" LIMIT 5');
    console.log('\nSample users:');
    console.table(sampleUsers.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkSchema();