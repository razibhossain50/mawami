const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSimpleMobileFix() {
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

    // Read and execute the simple migration
    const migrationPath = path.join(__dirname, 'migrations', '008_simple_mobile_fix.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    await client.query(migrationSQL);
    console.log('✅ Simple mobile fix migration completed successfully!');

    // Show current user data
    console.log('\n📋 Current user data:');
    const users = await client.query(`
      SELECT id, "fullName", mobile, email, role, "googleId"
      FROM "user" 
      ORDER BY id;
    `);
    
    users.rows.forEach(user => {
      console.log(`  - ID ${user.id}: ${user.fullName || 'No Name'} | Mobile: ${user.mobile || 'NULL'} | Email: ${user.email || 'NULL'} | Role: ${user.role} | Google: ${user.googleId ? 'Yes' : 'No'}`);
    });

    console.log('\n🎯 Authentication will work with:');
    console.log('  - Regular users: Use mobile number if available, or create new account');
    console.log('  - Admin users: Use email address');
    console.log('  - Google users: Use Google OAuth');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

runSimpleMobileFix();