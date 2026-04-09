const express = require('express');
const cors = require('cors');
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/supplier', supplierRoutes);
app.use('/inventory', inventoryRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Inventory Database Project API is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
