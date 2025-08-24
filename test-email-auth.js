#!/usr/bin/env node

/**
 * Test script to verify email-based authentication is working
 * This script tests both signup and login with email
 */

const API_BASE_URL = 'http://localhost:2000';

async function testEmailAuth() {
  console.log('🧪 Testing Email-Based Authentication\n');

  // Test data
  const testUser = {
    fullName: 'Test Email User',
    email: 'test.email@example.com',
    password: 'testpassword123',
    confirmPassword: 'testpassword123'
  };

  try {
    // Test 1: Signup with email
    console.log('1️⃣ Testing signup with email...');
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const signupData = await signupResponse.json();

    if (signupResponse.ok) {
      console.log('✅ Signup successful!');
      console.log('   User:', signupData.user);
      console.log('   Token received:', !!signupData.access_token);
    } else {
      console.log('❌ Signup failed:', signupData.message);
      
      // If user already exists, that's okay for testing
      if (signupData.message?.includes('already in use')) {
        console.log('   (User already exists, continuing with login test)');
      } else {
        return;
      }
    }

    // Test 2: Login with email
    console.log('\n2️⃣ Testing login with email...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const loginData = await loginResponse.json();

    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('   User:', loginData.user);
      console.log('   Token received:', !!loginData.access_token);
    } else {
      console.log('❌ Login failed:', loginData.message);
      return;
    }

    // Test 3: Test invalid email format
    console.log('\n3️⃣ Testing invalid email format...');
    const invalidEmailResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
        password: testUser.password,
      }),
    });

    const invalidEmailData = await invalidEmailResponse.json();

    if (!invalidEmailResponse.ok) {
      console.log('✅ Invalid email properly rejected:', invalidEmailData.message);
    } else {
      console.log('❌ Invalid email was accepted (this should not happen)');
    }

    console.log('\n🎉 Email-based authentication tests completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure the backend server is running on http://localhost:2000');
  }
}

// Run the test
testEmailAuth();