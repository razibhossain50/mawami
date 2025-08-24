const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMobileMigration() {
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
    const migrationPath = path.join(__dirname, 'migrations', '006_add_mobile_number_field.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await client.query(migrationSQL);
    console.log('✅ Mobile number migration completed successfully!');

    // Verify the changes
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      AND column_name IN ('mobile', 'email', 'googleId')
      ORDER BY column_name;
    `);

    console.log('\n📋 Updated user table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Show sample users with mobile numbers
    const users = await client.query(`
      SELECT id, "fullName", mobile, email, role, "googleId"
      FROM "user" 
      ORDER BY id 
      LIMIT 5;
    `);

    console.log('\n👥 Sample users after migration:');
    users.rows.forEach(user => {
      console.log(`  - ${user.fullName || 'No Name'}: ${user.mobile || 'No Mobile'} (${user.role}) ${user.googleId ? '[Google User]' : ''}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

runMobileMigration();