const axios = require('axios');

async function test() {
    const baseURL = 'http://localhost:3000';
    try {
        console.log('--- Testing POST /supplier (Edge Cases) ---');
        try {
            await axios.post(`${baseURL}/supplier`, {});
        } catch (e) {
            console.log('Empty input test passed:', e.response?.data?.message || e.message);
        }
        try {
            await axios.post(`${baseURL}/supplier`, { name: 'ABC Traders' });
        } catch (e) {
            console.log('Partial input test passed:', e.response?.data?.message || e.message);
        }

        const s1 = await axios.post(`${baseURL}/supplier`, { name: 'TechCorp', city: 'San Francisco' });
        const s2 = await axios.post(`${baseURL}/supplier`, { name: 'GadgetLine', city: 'London' });
        console.log(`Suppliers created with IDs: ${s1.data.supplierId}, ${s2.data.supplierId}`);

        console.log('\n--- Testing POST /inventory (Edge Cases) ---');
        try {
            await axios.post(`${baseURL}/inventory`, { supplier_id: 999, product_name: 'Laptop', quantity: 5, price: 50000 });
        } catch (e) {
            console.log('Invalid supplier test passed:', e.response?.data?.message || e.message);
        }
        try {
            await axios.post(`${baseURL}/inventory`, { supplier_id: s1.data.supplierId, product_name: 'Laptop', quantity: -5, price: 50000 });
        } catch (e) {
            console.log('Negative quantity test passed:', e.response?.data?.message || e.message);
        }
        await axios.post(`${baseURL}/inventory`, { supplier_id: s1.data.supplierId, product_name: 'Laptop', quantity: 0, price: 50000 });
        console.log('Zero quantity allowed.');

        try {
            await axios.post(`${baseURL}/inventory`, { supplier_id: s1.data.supplierId, product_name: 'Laptop', quantity: 5, price: -100 });
        } catch (e) {
            console.log('Negative price test passed:', e.response?.data?.message || e.message);
        }
        try {
            await axios.post(`${baseURL}/inventory`, { supplier_id: s1.data.supplierId, product_name: 'Laptop', quantity: 5, price: 0 });
        } catch (e) {
            console.log('Zero price test passed:', e.response?.data?.message || e.message);
        }
        try {
            await axios.post(`${baseURL}/inventory`, { supplier_id: s1.data.supplierId, product_name: 'Laptop', quantity: 'abc', price: 'xyz' });
        } catch (e) {
            console.log('String instead of number test passed:', e.response?.data?.message || e.message);
        }

        console.log('\n--- Testing GET /inventory (Grouped Query) ---');
        // Clear previous entries for clean grouped query test (optional since we just did Laptop with quantity 0 and 50000 price = 0)
        // Let's add specific items for sorting check
        await axios.post(`${baseURL}/inventory`, { supplier_id: s1.data.supplierId, product_name: 'Mouse', quantity: 50, price: 25 }); // 1250
        await axios.post(`${baseURL}/inventory`, { supplier_id: s2.data.supplierId, product_name: 'Smartphone', quantity: 20, price: 800 }); // 16000
        
        const res = await axios.get(`${baseURL}/inventory`);
        console.log('Results (Sorted DESC by value):');
        res.data.forEach(item => {
            console.log(`- ${item.supplier_name}: ${item.total_inventory_value}`);
        });

        // Verify sorting
        if (res.data.length >= 2) {
            const first = res.data[0].total_inventory_value;
            const second = res.data[1].total_inventory_value;
            if (first >= second) {
                console.log('✅ Sorting order verified (DESC)');
            } else {
                console.log('❌ Sorting order INCORRECT');
            }
        }

    } catch (error) {
        console.error('Test failed unexpectedly:', error.message);
        if (error.response) console.error('Response data:', error.response.data);
    }
}

test();
