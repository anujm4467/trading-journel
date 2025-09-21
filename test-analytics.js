// Test the analytics API
async function testAnalytics() {
  try {
    console.log('Testing analytics API...')
    
    // Test without filters
    const response1 = await fetch('http://localhost:3000/api/analytics')
    const data1 = await response1.json()
    console.log('All data:', data1)
    
    // Test with equity filter
    const response2 = await fetch('http://localhost:3000/api/analytics?instrumentType=EQUITY')
    const data2 = await response2.json()
    console.log('Equity only:', data2)
    
    // Test with options filter
    const response3 = await fetch('http://localhost:3000/api/analytics?instrumentType=OPTIONS')
    const data3 = await response3.json()
    console.log('Options only:', data3)
    
  } catch (error) {
    console.error('Error testing analytics:', error)
  }
}

// Wait a bit for the server to start, then test
setTimeout(testAnalytics, 5000)
