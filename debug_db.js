const db = require('./src/db/connection');

async function debug() {
    try {
        console.log('--- RAW INVENTORY ---');
        const raw = await db.query('SELECT * FROM inventory');
        console.log(JSON.stringify(raw, null, 2));

        console.log('\n--- GROUPED INVENTORY ---');
        const sql = `
            SELECT 
                s.id as supplier_id, 
                s.name as supplier_name, 
                SUM(i.quantity * i.price) AS total_inventory_value
            FROM suppliers s
            JOIN inventory i ON s.id = i.supplier_id
            GROUP BY s.id, s.name
            ORDER BY total_inventory_value DESC;
        `;
        const grouped = await db.query(sql);
        console.log(JSON.stringify(grouped, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
