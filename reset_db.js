const db = require('./src/db/connection');

async function reset() {
    try {
        await db.run('DELETE FROM inventory');
        await db.run('DELETE FROM suppliers');
        await db.run('DELETE FROM sqlite_sequence WHERE name IN ("suppliers", "inventory")');
        console.log('Database reset successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
}

reset();
