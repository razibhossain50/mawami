const { Client } = require('pg');

async function checkUsernames() {
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

    // Check all users and their usernames
    const users = await client.query('SELECT id, "fullName", email, username, role FROM "user" ORDER BY id');
    console.log('All users and their usernames:');
    console.table(users.rows);

    // Check for duplicate usernames
    const duplicates = await client.query(`
      SELECT username, COUNT(*) as count 
      FROM "user" 
      WHERE username IS NOT NULL 
      GROUP BY username 
      HAVING COUNT(*) > 1
    `);
    
    if (duplicates.rows.length > 0) {
      console.log('\nDuplicate usernames found:');
      console.table(duplicates.rows);
    } else {
      console.log('\nNo duplicate usernames found.');
    }

    // Check users without usernames
    const noUsername = await client.query('SELECT id, "fullName", email FROM "user" WHERE username IS NULL');
    console.log(`\nUsers without username: ${noUsername.rows.length}`);
    if (noUsername.rows.length > 0) {
      console.table(noUsername.rows);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkUsernames();