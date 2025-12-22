// Base URL
const API_BASE = 'http://localhost:5000';

async function testDealRequests() {
    console.log('--- Testing Deal Requests API ---');

    let dealId;

    // 1. Fetch Deals to get a valid deal ID
    try {
        console.log('\n1. Fetching Deals...');
        const dealsRes = await fetch(`${API_BASE}/deals?isActive=true`);
        if (!dealsRes.ok) throw new Error(`Failed to fetch deals: ${dealsRes.status}`);
        const dealsData = await dealsRes.json();

        if (dealsData.items && dealsData.items.length > 0) {
            dealId = dealsData.items[0]._id;
            console.log(`   Found deal: ${dealId} - ${dealsData.items[0].title}`);
        } else {
            console.log('   No deals found. Cannot proceed with request test.');
            return;
        }
    } catch (e) {
        console.error('   Error fetching deals:', e.message);
        return;
    }

    // 2. Create a Deal Request
    try {
        console.log('\n2. Creating Deal Request...');
        const payload = {
            dealId: dealId,
            user: {
                name: 'Test Verify User',
                email: 'verify@example.com',
                phone: '123-456-7890'
            }
        };

        const createRes = await fetch(`${API_BASE}/deal-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) {
            const errText = await createRes.text();
            throw new Error(`Failed to create request: ${createRes.status} - ${errText}`);
        }

        const createData = await createRes.json();
        console.log('   Success! Created request:', createData._id);
        console.log('   Status:', createData.status);
    } catch (e) {
        console.error('   Error creating deal request:', e.message);
    }

    // 3. Fetch Deal Requests (Admin)
    try {
        console.log('\n3. Fetching Deal Requests (Admin)...');
        // Note: In a real scenario we'd need auth headers if protected
        const listRes = await fetch(`${API_BASE}/deal-requests`);

        if (!listRes.ok) throw new Error(`Failed to fetch requests: ${listRes.status}`);

        const listData = await listRes.json();
        const found = listData.find(d => d.user.email === 'verify@example.com');

        if (found) {
            console.log(`   Success! Found the created request in list.`);
            console.log(`   Total requests: ${listData.length}`);
        } else {
            console.log('   Warning: Created request not found in list.');
        }
    } catch (e) {
        console.error('   Error fetching list:', e.message);
    }

    console.log('\n--- Test Complete ---');
}

testDealRequests();
