const { Client } = require('pg');

async function fixUsernames() {
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

    // Get users without usernames
    const usersWithoutUsername = await client.query('SELECT id, "fullName", email FROM "user" WHERE username IS NULL');
    console.log(`Found ${usersWithoutUsername.rows.length} users without usernames`);

    for (const user of usersWithoutUsername.rows) {
      let username;
      
      if (user.email) {
        // Generate username from email
        const emailPrefix = user.email.split('@')[0];
        username = emailPrefix.length >= 8 ? emailPrefix : `${emailPrefix}_${user.id}`;
        
        // Ensure username is at least 8 characters
        if (username.length < 8) {
          username = `user_${user.id}_${Date.now()}`;
        }
      } else {
        // Fallback username
        username = `user_${user.id}_${Date.now()}`;
      }

      // Check if username already exists and make it unique
      let finalUsername = username;
      let counter = 1;
      while (true) {
        const existing = await client.query('SELECT id FROM "user" WHERE username = $1', [finalUsername]);
        if (existing.rows.length === 0) {
          break;
        }
        finalUsername = `${username}_${counter}`;
        counter++;
      }

      // Update the user
      await client.query('UPDATE "user" SET username = $1 WHERE id = $2', [finalUsername, user.id]);
      console.log(`Updated user ${user.id} (${user.fullName}) with username: ${finalUsername}`);
    }

    // Verify all users now have usernames
    const stillWithoutUsername = await client.query('SELECT COUNT(*) FROM "user" WHERE username IS NULL');
    console.log(`\nUsers still without username: ${stillWithoutUsername.rows[0].count}`);

    // Show final result
    const allUsers = await client.query('SELECT id, "fullName", username, role FROM "user" ORDER BY id');
    console.log('\nFinal user list:');
    console.table(allUsers.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

fixUsernames();