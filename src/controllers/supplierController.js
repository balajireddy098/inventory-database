const db = require('../db/connection');

exports.createSupplier = async (req, res) => {
    try {
        const { name, city } = req.body;

        if (!name || !city) {
            return res.status(400).json({ message: 'Name and city required' });
        }

        const result = await db.run(
            'INSERT INTO suppliers (name, city) VALUES (?, ?)',
            [name, city]
        );

        res.status(201).json({
            message: 'Supplier created successfully',
            supplierId: result.id
        });
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getSuppliers = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM suppliers');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

