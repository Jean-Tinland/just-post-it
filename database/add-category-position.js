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
      `ALTER TABLE category ADD COLUMN position INTEGER NOT NULL DEFAULT 0`,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(
            "category table updated successfully: position column added.",
          );
        }
      },
    );
  });
};

migrate();
