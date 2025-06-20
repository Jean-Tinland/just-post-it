const path = require("path");
const sqlite3 = require("sqlite3");

const dbPath = path.join(process.cwd(), "just-post-it.db");

const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  },
);

const migrate = () => {
  db.serialize(() => {
    db.run(
      `
      CREATE TABLE category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT 'New category',
        color TEXT NOT NULL DEFAULT 'red',
        position INTEGER NOT NULL DEFAULT 0
    );
    `,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.info("category table created successfully.");
        }
      },
    );
    db.run(
      `
      CREATE TABLE post_it (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL DEFAULT 'New idea',
        due_date DATE NULL,
        top_position REAL NOT NULL DEFAULT 10,
        left_position REAL NOT NULL DEFAULT 10,
        width REAL NOT NULL DEFAULT 380,
        height REAL NOT NULL DEFAULT 240,
        content TEXT NOT NULL DEFAULT '',
        category_id INTEGER NULL,
        last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        minimized INTEGER NOT NULL DEFAULT 0
    );
    `,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.info("post_it table created successfully.");
        }
      },
    );
    db.run(
      `
      CREATE TABLE preference (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL DEFAULT '',
        value TEXT NOT NULL DEFAULT ''
    );
    `,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.info("preference table created successfully.");
        }
      },
    );
  });
};

migrate();
