const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('pog.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.get("PRAGMA foreign_keys = ON")
    console.log('Connected to PoG');
});

module.exports = db