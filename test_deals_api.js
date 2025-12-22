
async function testDeals() {
    try {
        console.log('Fetching deals...');
        const response = await fetch('http://localhost:5000/deals?isActive=true');
        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Raw text:', text);
        const data = JSON.parse(text);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testDeals();
