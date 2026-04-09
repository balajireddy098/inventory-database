const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../inventory.db');
const schemaPath = path.resolve(__dirname, './schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database:', err.message);
        } else {
            console.log('Database initialized successfully.');
            // Enable foreign keys
            db.run('PRAGMA foreign_keys = ON;', (err) => {
                if (err) {
                    console.error('Error enabling foreign keys:', err.message);
                } else {
                    console.log('Foreign key support enabled.');
                }
            });
        }
    });
}

// Wrapper to use async/await with sqlite3
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

module.exports = {
    db,
    query,
    run,
    get
};
