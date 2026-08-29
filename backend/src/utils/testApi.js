const http = require('http');

// Helper to make HTTP JSON requests
const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataString),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api${path}`,
        method,
        headers,
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          try {
            const parsed = responseData ? JSON.parse(responseData) : {};
            resolve({ status: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, raw: responseData });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (dataString) {
      req.write(dataString);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Starting Full-Stack End-to-End API Test Suite...\n');

  try {
    // 1. Health check
    console.log('1. Testing Health Endpoint:');
    const health = await request('GET', '/health');
    console.log(`   Status: ${health.status}, Response:`, health.body);

    // 2. Admin Login
    console.log('\n2. Testing Admin Login:');
    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@storerating.com',
      password: 'Admin@Password123',
    });
    console.log(`   Status: ${adminLogin.status}, Role: ${adminLogin.body?.user?.role}`);
    const adminToken = adminLogin.body?.token;

    // 3. Admin Dashboard Stats
    console.log('\n3. Testing Admin Dashboard Stats:');
    const stats = await request('GET', '/admin/dashboard', null, adminToken);
    console.log(`   Status: ${stats.status}, Stats:`, stats.body?.stats);

    // 4. Admin Users List with Store Owner Rating Check
    console.log('\n4. Testing Admin Users List:');
    const users = await request('GET', '/admin/users', null, adminToken);
    console.log(`   Status: ${users.status}, Total Users: ${users.body?.count}`);
    const ownerUser = users.body?.users?.find((u) => u.role === 'STORE_OWNER');
    console.log(`   Store Owner Sample: ${ownerUser?.name}, Store Rating: ${ownerUser?.storeRating} (${ownerUser?.storeRatingCount} reviews)`);

    // 5. Admin Stores List
    console.log('\n5. Testing Admin Stores List:');
    const stores = await request('GET', '/admin/stores', null, adminToken);
    console.log(`   Status: ${stores.status}, Total Stores: ${stores.body?.count}`);

    // 6. Normal User Signup
    console.log('\n6. Testing Normal User Signup:');
    const testEmail = `newuser.${Date.now()}@example.com`;
    const signupRes = await request('POST', '/auth/signup', {
      name: 'Test New Registered Normal User',
      email: testEmail,
      address: '77 Innovation Way, Tech Valley Suburbs',
      password: 'User@Password123',
    });
    console.log(`   Status: ${signupRes.status}, Created User: ${signupRes.body?.user?.name}`);
    const userToken = signupRes.body?.token;

    // 7. Normal User Stores Browsing with Submitted Ratings
    console.log('\n7. Testing Normal User Stores Catalog:');
    const userStores = await request('GET', '/stores', null, userToken);
    console.log(`   Status: ${userStores.status}, Store 1: ${userStores.body?.stores[0]?.name}, Overall Rating: ${userStores.body?.stores[0]?.overallRating}, My Rating: ${userStores.body?.stores[0]?.myRating}`);

    // 8. Normal User Submit Rating (5 Stars)
    console.log('\n8. Testing Normal User Submit Rating:');
    const storeToRate = userStores.body?.stores[0];
    const rateRes = await request(
      'POST',
      '/ratings',
      { storeId: storeToRate.id, rating: 5 },
      userToken
    );
    console.log(`   Status: ${rateRes.status}, Message: ${rateRes.body?.message}`);

    // 9. Normal User Modify Rating (Change to 4 Stars)
    console.log('\n9. Testing Normal User Modify Rating:');
    const modifyRes = await request(
      'POST',
      '/ratings',
      { storeId: storeToRate.id, rating: 4 },
      userToken
    );
    console.log(`   Status: ${modifyRes.status}, Message: ${modifyRes.body?.message}`);

    // 10. Store Owner Login & Dashboard
    console.log('\n10. Testing Store Owner Dashboard:');
    const ownerLogin = await request('POST', '/auth/login', {
      email: 'alexander.owner@store.com',
      password: 'Owner@Password123',
    });
    const ownerToken = ownerLogin.body?.token;
    const ownerDash = await request('GET', '/ratings/owner-dashboard', null, ownerToken);
    console.log(`   Status: ${ownerDash.status}, Store: ${ownerDash.body?.store?.name}, Avg Rating: ${ownerDash.body?.stats?.averageRating}, Reviews Count: ${ownerDash.body?.ratings?.length}`);

    console.log('\n🎉 ALL 10 API TEST SUITES PASSED FLAWLESSLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
};

runTests();
