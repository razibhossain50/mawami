const fetch = require('node-fetch');

async function testProfileViewTracking() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('Testing profile view tracking...');
    
    // Test tracking a profile view
    const trackResponse = await fetch(`${baseUrl}/api/biodatas/1/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (trackResponse.ok) {
      const trackResult = await trackResponse.json();
      console.log('✅ Profile view tracked:', trackResult);
    } else {
      console.log('❌ Failed to track profile view:', trackResponse.status, trackResponse.statusText);
    }
    
    // Test getting view count
    const countResponse = await fetch(`${baseUrl}/api/biodatas/1/view-count`);
    
    if (countResponse.ok) {
      const countResult = await countResponse.json();
      console.log('✅ View count retrieved:', countResult);
    } else {
      console.log('❌ Failed to get view count:', countResponse.status, countResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProfileViewTracking();