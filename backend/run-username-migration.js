const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
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

    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '006_add_username_column.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await client.query(migrationSQL);
    console.log('Username migration completed successfully!');

    // Verify the migration
    const result = await client.query('SELECT id, username, email FROM "user" LIMIT 5');
    console.log('Sample users after migration:');
    console.table(result.rows);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

runMigration();