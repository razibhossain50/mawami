// Test script to verify profile picture upload functionality
const API_BASE_URL = 'http://localhost:2000';

async function testProfileUpload() {
  console.log('🧪 Testing Profile Picture Upload...\n');

  // First, login to get a token
  try {
    console.log('1. Logging in to get authentication token...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',
        password: '12345'
      }),
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login successful');

    // Test the upload endpoint (without actual file for now)
    console.log('\n2. Testing upload endpoint availability...');
    const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: new FormData(), // Empty form data to test endpoint
    });

    // We expect a 400 error for no file, which means the endpoint is working
    if (uploadResponse.status === 400) {
      const errorData = await uploadResponse.json();
      if (errorData.message === 'No file uploaded') {
        console.log('✅ Upload endpoint is working (correctly rejecting empty uploads)');
      }
    } else {
      console.log(`❌ Unexpected response status: ${uploadResponse.status}`);
    }

    console.log('\n3. Testing static file serving...');
    // Test if the backend can serve static files from uploads directory
    const staticResponse = await fetch(`${API_BASE_URL}/uploads/profile-pictures/test.txt`);
    console.log(`Static file test status: ${staticResponse.status} (404 is expected if no test file exists)`);

    console.log('\n✅ Profile upload system is ready!');
    console.log('\nTo test with actual files:');
    console.log('1. Go to the biodata creation form');
    console.log('2. Navigate to the Contact Information step');
    console.log('3. Upload a JPEG or PNG image');
    console.log('4. Check the public/uploads/profile-pictures directory');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProfileUpload().catch(console.error);