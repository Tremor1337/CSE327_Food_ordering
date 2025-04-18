// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or open database file
const dbPath = path.resolve(__dirname, '../database/food_ordering.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('SQLite DB connection failed:', err.message);
    } else {
        console.log('Connected to SQLite DB at', dbPath);
    }
});

module.exports = db;
