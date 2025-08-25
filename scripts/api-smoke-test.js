#!/usr/bin/env node
/*
 * API smoke test covering key endpoints with /api prefix.
 */
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000';

async function main() {
  console.log('🧪 API Smoke Test Starting...');

  // Signup (may fail if already exists)
  const signup = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Smoke User', email: 'smoke@example.com', password: 'password123', confirmPassword: 'password123' })
  });
  console.log('Signup:', signup.status);

  // Login
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'smoke@example.com', password: 'password123' })
  });
  const login = await loginRes.json().catch(() => ({}));
  console.log('Login:', loginRes.status, !!login.access_token);
  const token = login.access_token;

  // Public biodatas
  const biodatas = await fetch(`${BASE}/api/biodatas`);
  console.log('GET /api/biodatas:', biodatas.status);

  // Search biodatas
  const search = await fetch(`${BASE}/api/biodatas/search?biodataType=Male&religion=Islam`);
  console.log('GET /api/biodatas/search:', search.status);

  // Google OAuth (redirect expected)
  const google = await fetch(`${BASE}/api/auth/google`, { redirect: 'manual' });
  console.log('GET /api/auth/google:', google.status);

  if (token) {
    // Auth check
    const auth = await fetch(`${BASE}/api/users/test-auth`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('GET /api/users/test-auth:', auth.status);

    // Favorites
    const favList = await fetch(`${BASE}/api/favorites`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('GET /api/favorites:', favList.status);

    const favCheck = await fetch(`${BASE}/api/favorites/check/1`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('GET /api/favorites/check/1:', favCheck.status);
  }

  // Admin endpoints (expect 401 with user token)
  const adminUsers = await fetch(`${BASE}/api/users`);
  console.log('GET /api/users (no token):', adminUsers.status);

  const adminLogin = await fetch(`${BASE}/api/auth/admin/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
  });
  console.log('POST /api/auth/admin/login:', adminLogin.status);

  console.log('✅ API Smoke Test Finished');
}

main().catch((e) => { console.error('❌ Smoke test failed:', e.message); process.exit(1); });


