const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '12345',
    database: 'Finder'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '005_add_google_auth_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await client.query(migrationSQL);
    console.log('✅ Google OAuth migration completed successfully!');

    // Verify the changes
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      AND column_name IN ('googleId', 'profilePicture', 'password')
      ORDER BY column_name;
    `);

    console.log('\n📋 Updated user table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

runMigration();