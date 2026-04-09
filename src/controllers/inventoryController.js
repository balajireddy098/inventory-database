const db = require('../db/connection');

exports.createInventory = async (req, res) => {
    try {
        const { supplier_id, product_name, quantity, price } = req.body;

        // Validation
        if (!supplier_id || !product_name || quantity === undefined || price === undefined) {
            const missing = [];
            if (!supplier_id) missing.push('supplier_id');
            if (!product_name) missing.push('product_name');
            if (quantity === undefined) missing.push('quantity');
            if (price === undefined) missing.push('price');
            return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
        }

        if (typeof quantity !== 'number' || isNaN(quantity)) {
            return res.status(400).json({ message: 'Quantity must be a number' });
        }

        if (typeof price !== 'number' || isNaN(price)) {
            return res.status(400).json({ message: 'Price must be a number' });
        }

        if (quantity < 0) {
            return res.status(400).json({ message: 'Quantity must be >= 0' });
        }

        if (price <= 0) {
            return res.status(400).json({ message: 'Price must be > 0' });
        }

        // Check if supplier exists
        const supplier = await db.get('SELECT id FROM suppliers WHERE id = ?', [supplier_id]);
        if (!supplier) {
            return res.status(400).json({ message: 'Invalid supplier_id' });
        }

        const result = await db.run(
            'INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
            [supplier_id, product_name, quantity, price]
        );

        res.status(201).json({
            message: 'Inventory item created successfully',
            inventoryId: result.id
        });
    } catch (error) {
        console.error('Error creating inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getInventory = async (req, res) => {
    try {
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

        const results = await db.query(sql);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllInventory = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM inventory');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching all inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

