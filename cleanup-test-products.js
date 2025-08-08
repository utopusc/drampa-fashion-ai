const axios = require('axios');

const BACKEND_URL = 'https://31.220.81.177';

// Ignore SSL certificate errors (for self-signed cert)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function cleanupTestProducts() {
  console.log('🧹 Cleaning up test products...\n');
  
  try {
    // Login first
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'bruceoz@gmail.com',
      password: 'Ada1096754!!26'
    });
    
    const authToken = loginResponse.data.token;
    console.log('✅ Logged in successfully\n');
    
    // Get all products
    console.log('📋 Fetching products...');
    const productsResponse = await axios.get(`${BACKEND_URL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const products = productsResponse.data.products;
    console.log(`Found ${products.length} products\n`);
    
    // Filter test products
    const testProducts = products.filter(p => 
      p.name.toLowerCase().includes('test') || 
      p.name.includes('175468') // Test product timestamp
    );
    
    if (testProducts.length === 0) {
      console.log('✅ No test products to clean up');
      return;
    }
    
    console.log(`🗑️  Found ${testProducts.length} test products to delete:`);
    testProducts.forEach(p => {
      console.log(`   - ${p.name} (${p._id})`);
    });
    
    console.log('\n🔥 Deleting test products...');
    
    for (const product of testProducts) {
      try {
        await axios.delete(`${BACKEND_URL}/api/products/${product._id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        console.log(`   ✅ Deleted: ${product.name}`);
      } catch (error) {
        console.log(`   ❌ Failed to delete: ${product.name}`);
      }
    }
    
    console.log('\n✨ Cleanup complete!');
    
    // Show remaining products
    const remainingResponse = await axios.get(`${BACKEND_URL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log(`\n📦 Remaining products: ${remainingResponse.data.products.length}`);
    remainingResponse.data.products.forEach(p => {
      console.log(`   - ${p.name} (${p.type})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanupTestProducts();