// Base URL
const API_BASE = 'http://localhost:5000';

async function testEnhancements() {
    console.log('--- Testing Enhancements (Status Update) ---');

    let dealId;
    let requestId;

    // 1. Fetch Deals
    try {
        const dealsRes = await fetch(`${API_BASE}/deals?isActive=true`);
        if (!dealsRes.ok) throw new Error(`Failed to fetch deals: ${dealsRes.status}`);
        const dealsData = await dealsRes.json();

        if (dealsData.items && dealsData.items.length > 0) {
            dealId = dealsData.items[0]._id;
        } else {
            console.log('   No deals found. Cannot proceed.');
            return;
        }
    } catch (e) {
        console.error('   Error fetching deals:', e.message);
        return;
    }

    // 2. Create a Request
    try {
        const payload = {
            dealId: dealId,
            user: { name: 'Status Test', email: 'status@test.com', phone: '000' }
        };
        const createRes = await fetch(`${API_BASE}/deal-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const createData = await createRes.json();
        requestId = createData._id;
        console.log(`   Created request: ${requestId} (Status: ${createData.status})`);
    } catch (e) {
        console.error('   Error creating request:', e.message);
        return;
    }

    // 3. Update Status
    try {
        console.log('\n   Updating status to "confirmed" (invalid status check)...');
        // Check invalid status first
        const invalidRes = await fetch(`${API_BASE}/deal-requests/${requestId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'invalid_status' })
        });
        console.log(`   Invalid update response: ${invalidRes.status} (Expected 400)`);

        console.log('\n   Updating status to "completed"...');
        const updateRes = await fetch(`${API_BASE}/deal-requests/${requestId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });

        if (!updateRes.ok) throw new Error(`Failed to update status: ${updateRes.status}`);

        const updateData = await updateRes.json();
        console.log(`   Updated status: ${updateData.status} (Expected: completed)`);

        if (updateData.status === 'completed') {
            console.log('   ✅ Status update verified.');
        } else {
            console.log('   ❌ Status matched failed.');
        }

    } catch (e) {
        console.error('   Error updating status:', e.message);
    }

    console.log('\n--- Test Complete ---');
}

testEnhancements();
