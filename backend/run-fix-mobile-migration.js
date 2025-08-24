const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runFixMobileMigration() {
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

    // First, let's see the current state of users
    console.log('\n📋 Current user data before migration:');
    const beforeUsers = await client.query(`
      SELECT id, "fullName", mobile, email, role, "googleId"
      FROM "user" 
      ORDER BY id;
    `);
    
    beforeUsers.rows.forEach(user => {
      console.log(`  - ID ${user.id}: ${user.fullName || 'No Name'} | Mobile: ${user.mobile || 'NULL'} | Email: ${user.email || 'NULL'} | Role: ${user.role} | Google: ${user.googleId ? 'Yes' : 'No'}`);
    });

    // Read and execute the migration file
    const migrationPath = path.join(__dirname, 'migrations', '007_fix_mobile_constraints.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    await client.query(migrationSQL);
    console.log('\n✅ Mobile constraints fix migration completed successfully!');

    // Show the updated state
    console.log('\n📋 User data after migration:');
    const afterUsers = await client.query(`
      SELECT id, "fullName", mobile, email, role, "googleId"
      FROM "user" 
      ORDER BY id;
    `);
    
    afterUsers.rows.forEach(user => {
      console.log(`  - ID ${user.id}: ${user.fullName || 'No Name'} | Mobile: ${user.mobile || 'NULL'} | Email: ${user.email || 'NULL'} | Role: ${user.role} | Google: ${user.googleId ? 'Yes' : 'No'}`);
    });

    // Verify constraints
    const constraints = await client.query(`
      SELECT conname, contype 
      FROM pg_constraint 
      WHERE conrelid = 'user'::regclass;
    `);

    console.log('\n🔒 Active constraints:');
    constraints.rows.forEach(constraint => {
      console.log(`  - ${constraint.conname}: ${constraint.contype}`);
    });

    // Test the authentication accounts
    console.log('\n🧪 Testing authentication accounts:');
    
    // Test regular user
    const regularUser = await client.query(`
      SELECT id, "fullName", mobile, email, role 
      FROM "user" 
      WHERE mobile = '01800000000' OR email = 'user@example.com'
      LIMIT 1;
    `);
    
    if (regularUser.rows.length > 0) {
      console.log(`  ✅ Regular user: ${regularUser.rows[0].mobile || regularUser.rows[0].email} (${regularUser.rows[0].role})`);
    }

    // Test admin user
    const adminUser = await client.query(`
      SELECT id, "fullName", mobile, email, role 
      FROM "user" 
      WHERE email = 'admin@example.com'
      LIMIT 1;
    `);
    
    if (adminUser.rows.length > 0) {
      console.log(`  ✅ Admin user: ${adminUser.rows[0].email} (${adminUser.rows[0].role})`);
    }

    // Test superadmin user
    const superAdminUser = await client.query(`
      SELECT id, "fullName", mobile, email, role 
      FROM "user" 
      WHERE email = 'superadmin@finder.com' OR mobile = '01700000000'
      LIMIT 1;
    `);
    
    if (superAdminUser.rows.length > 0) {
      console.log(`  ✅ Superadmin user: ${superAdminUser.rows[0].email || superAdminUser.rows[0].mobile} (${superAdminUser.rows[0].role})`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
  }
}

runFixMobileMigration();