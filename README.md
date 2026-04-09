# Inventory Database Project

A simple inventory management system built with Node.js, Express, and SQLite.

## Features

- Create Suppliers (`POST /supplier`)
- Create Inventory items (`POST /inventory`)
- Fetch total inventory value grouped by supplier (`GET /inventory`)
- Data validation (Quantity >= 0, Price > 0)
- Foreign key constraints (Inventory must belong to a valid supplier)

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite
- **Middleware**: CORS, Express JSON parser

## Database Schema

The database consists of two tables:

### Suppliers
- `id`: Primary Key, Auto-increment
- `name`: Supplier name
- `city`: Supplier city

### Inventory
- `id`: Primary Key, Auto-increment
- `supplier_id`: Foreign Key referencing Suppliers(id)
- `product_name`: Name of the product
- `quantity`: Amount in stock (must be >= 0)
- `price`: Unit price (must be > 0)

## Design Choices: SQL vs NoSQL

I chose **SQL (SQLite)** for this project because:
1. **Relational Data**: The relationship between suppliers and inventory is inherently nested and relational (1-to-many). SQL maintains this structure naturally via foreign keys.
2. **Data Integrity**: SQL provides strong constraints (NOT NULL, CHECK, FOREIGN KEY) which ensure that inventory always belongs to a valid supplier and that business rules (like positive price) are enforced at the database level.
3. **Complex Aggregation**: The required query (grouping by supplier and calculating total value) is a standard SQL operation, making it efficient and easy to implement using `GROUP BY` and `SUM`.

## Optimization Suggestion

**Indexing**: To optimize the performance of the grouped query and general lookups, I suggest adding an index on the `supplier_id` column in the `inventory` table.
```sql
CREATE INDEX idx_inventory_supplier_id ON inventory(supplier_id);
```
Since `supplier_id` is frequently used in `JOIN` operations and `GROUP BY` clauses, an index would significantly speed up these queries as the database grows.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/inventory-database-project.git
   cd inventory-database-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

## How to Run Locally

1. Start the server:
   ```bash
   npm start
   ```
2. The server will run on `http://localhost:3000` (or your configured PORT).

3. Test the API:
   ```bash
   npm test
   ```

## API Endpoints

### GET /supplier
Returns a list of all suppliers.

### POST /supplier

Request body:
```json
{
  "name": "Supplier A",
  "city": "New York"
}
```

### POST /inventory
Request body:
```json
{
  "supplier_id": 1,
  "product_name": "Laptop",
  "quantity": 10,
  "price": 1200.50
}
```

### GET /inventory
Returns a raw list of all individual inventory items.

### GET /inventory/grouped
Returns all inventory grouped by supplier, sorted by total inventory value.

## Deployment

### Deploy on Render

1. Push your code to GitHub
2. Connect your repository to [Render](https://render.com)
3. Create a new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy!

### Deploy on Vercel (Recommended for Frontend)

If you add a frontend, deploy it on Vercel and use the backend URL from Render.

**Note**: This backend uses SQLite, which works well for demos. For production with persistent data, consider migrating to PostgreSQL on Render.

## Future Improvements

- [ ] Migrate database to PostgreSQL for production
- [ ] Add request logging middleware
- [ ] Add API rate limiting
- [ ] Add unit tests
- [ ] Add input sanitization
- [ ] Add API documentation (Swagger/OpenAPI)


