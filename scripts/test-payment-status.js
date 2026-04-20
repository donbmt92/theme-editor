// Using built-in fetch (Node.js 18+)

async function testPaymentStatus() {
  const paymentId = 'TXN_1753293350797_mkx2vp3gf';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    console.log(`🔍 Checking payment status for ID: ${paymentId}`);
    console.log(`📡 Making request to: ${baseUrl}/api/payments/${paymentId}`);
    
    const response = await fetch(`${baseUrl}/api/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Note: This endpoint requires authentication
        // You'll need to be logged in to access it
      }
    });

    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Payment found:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.payment) {
        console.log('\n📋 Payment Details:');
        console.log(`   ID: ${data.payment.id}`);
        console.log(`   Status: ${data.payment.status}`);
        console.log(`   Amount: ${data.payment.amount} ${data.payment.currency}`);
        console.log(`   Bank Transaction ID: ${data.payment.bankTxnId || 'N/A'}`);
        console.log(`   Created: ${new Date(data.payment.createdAt).toLocaleString()}`);
        console.log(`   Paid: ${data.payment.paidAt ? new Date(data.payment.paidAt).toLocaleString() : 'Not paid yet'}`);
      }
    } else {
      const errorData = await response.json();
      console.log('❌ Error response:');
      console.log(JSON.stringify(errorData, null, 2));
      
      if (response.status === 401) {
        console.log('\n🔐 Authentication required!');
        console.log('You need to be logged in to access this payment.');
        console.log('Try visiting the website and logging in first.');
      } else if (response.status === 404) {
        console.log('\n🔍 Payment not found!');
        console.log('This payment ID does not exist or you do not have access to it.');
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Alternative: Test with curl command
function showCurlCommand() {
  const paymentId = 'TXN_1753293350797_mkx2vp3gf';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  console.log('\n🔄 Alternative: Use curl command:');
  console.log(`curl -X GET "${baseUrl}/api/payments/${paymentId}" \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Cookie: your-session-cookie-here"');
  
  console.log('\n📝 Note: You need to replace "your-session-cookie-here" with your actual session cookie');
  console.log('   You can get this by logging into the website and copying the session cookie from your browser');
}

// Run the test
testPaymentStatus().then(() => {
  showCurlCommand();
}); 