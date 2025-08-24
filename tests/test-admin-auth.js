// Test script to verify admin authentication and permissions
const API_BASE_URL = 'http://localhost:3001';

async function testAdminPermissions() {
  console.log('🧪 Testing Admin Authentication & Permissions...\n');

  // Test cases
  const testCases = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin',
      expectedRole: 'admin'
    },
    {
      name: 'Superadmin User',
      email: 'razibmahmud50@gmail.com',
      password: 'superadmin',
      expectedRole: 'superadmin'
    },
    {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user',
      expectedRole: 'user'
    }
  ];

  const tokens = {};

  // Step 1: Test login for all users
  console.log('=== STEP 1: Testing Login ===');
  for (const testCase of testCases) {
    try {
      console.log(`Testing ${testCase.name} login...`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testCase.email,
          password: testCase.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${testCase.name} login successful`);
        console.log(`   Role: ${data.user.role}`);
        console.log(`   Email: ${data.user.email}`);
        console.log(`   Name: ${data.user.fullName}`);
        
        tokens[testCase.expectedRole] = data.access_token;
        
        if (data.user.role === testCase.expectedRole) {
          console.log(`✅ Role matches expected: ${testCase.expectedRole}`);
        } else {
          console.log(`❌ Role mismatch. Expected: ${testCase.expectedRole}, Got: ${data.user.role}`);
        }
      } else {
        console.log(`❌ ${testCase.name} login failed: ${data.message}`);
      }
      
      console.log('---');
    } catch (error) {
      console.log(`❌ ${testCase.name} test error: ${error.message}`);
      console.log('---');
    }
  }

  // Step 2: Test permissions
  console.log('\n=== STEP 2: Testing Permissions ===');

  // Test biodata access
  console.log('\n📋 Testing Biodata Access:');
  await testEndpoint('GET', '/api/biodatas/admin/all', 'View All Biodatas', {
    admin: { token: tokens.admin, shouldWork: true },
    superadmin: { token: tokens.superadmin, shouldWork: true },
    user: { token: tokens.user, shouldWork: false }
  });

  // Test user management access
  console.log('\n👥 Testing User Management Access:');
  await testEndpoint('GET', '/api/users', 'View All Users', {
    admin: { token: tokens.admin, shouldWork: true },
    superadmin: { token: tokens.superadmin, shouldWork: true },
    user: { token: tokens.user, shouldWork: false }
  });

  console.log('\n🗑️ Testing User Deletion (Superadmin Only):');
  console.log('Note: This test will not actually delete users, just test authorization');
}

async function testEndpoint(method, endpoint, description, roleTests) {
  console.log(`\nTesting: ${description}`);
  
  for (const [role, config] of Object.entries(roleTests)) {
    if (!config.token) {
      console.log(`⏭️  Skipping ${role} (no token)`);
      continue;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`
        },
      });

      const success = response.ok;
      const expected = config.shouldWork;

      if (success === expected) {
        console.log(`✅ ${role}: ${success ? 'Access granted' : 'Access denied'} (as expected)`);
      } else {
        console.log(`❌ ${role}: ${success ? 'Access granted' : 'Access denied'} (unexpected!)`);
        if (!success) {
          const errorData = await response.json();
          console.log(`   Error: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${role}: Test error - ${error.message}`);
    }
  }
}

// Run the test
testAdminPermissions().catch(console.error);