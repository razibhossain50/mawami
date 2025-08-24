// Simple test script to test biodata API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:2000';

async function createTestUser() {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Test user created successfully:', data);
      return data.access_token;
    } else {
      const error = await response.text();
      console.log('❌ Failed to create test user:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating test user:', error.message);
    return null;
  }
}

async function testBiodataEndpoints() {
  console.log('🧪 Testing biodata API endpoints...\n');

  // Test GET /api/biodatas/current
  try {
    const response = await fetch(`${BASE_URL}/api/biodatas/current`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GET /api/biodatas/current works:', data);
    } else {
      console.log('❌ GET /api/biodatas/current failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Error testing GET endpoint:', error.message);
  }

  // Test PUT /api/biodatas/current
  try {
    const testData = {
      religion: 'Islam',
      biodataType: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1990-01-01',
      age: 34,
      height: '5.8',
      weight: 70,
      skinColor: 'Fair',
      profession: 'Software Engineer',
      bloodGroup: 'A+',
      step: 1,
      completedSteps: [1],
    };

    const response = await fetch(`${BASE_URL}/api/biodatas/current`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ PUT /api/biodatas/current works:', data);
    } else {
      const error = await response.text();
      console.log('❌ PUT /api/biodatas/current failed:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error testing PUT endpoint:', error.message);
  }
}

async function main() {
  // Create a test user first
  await createTestUser();
  
  // Test biodata endpoints
  await testBiodataEndpoints();
}

main().catch(console.error);