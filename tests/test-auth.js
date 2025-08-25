const fetch = require('node-fetch');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000';

async function testSignup() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
    });

    const data = await response.json();
    console.log('Signup Response:', response.status, data);
  } catch (error) {
    console.error('Signup Error:', error.message);
  }
}

async function testLogin() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Login Response:', response.status, data);
  } catch (error) {
    console.error('Login Error:', error.message);
  }
}

// Test both endpoints
testSignup().then(() => {
  setTimeout(testLogin, 1000);
});