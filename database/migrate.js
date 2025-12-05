const path = require("path");
const fs = require("fs").promises;
const sqlite3 = require("sqlite3");
const matter = require("gray-matter");

const dbPath = path.join(process.cwd(), "just-post-it.db");
const contentsDir = path.join(process.cwd(), "contents");
const categoriesFile = path.join(contentsDir, "categories.json");

// Check if database exists
async function checkDatabase() {
  try {
    await fs.access(dbPath);
    return true;
  } catch {
    console.log("❌ No database file found at:", dbPath);
    console.log("   Nothing to migrate.");
    return false;
  }
}

// Ensure contents directory exists
async function ensureContentsDir() {
  try {
    await fs.access(contentsDir);
    console.log("✓ Contents directory already exists");
  } catch {
    await fs.mkdir(contentsDir, { recursive: true });
    console.log("✓ Created contents directory");
  }
}

// Query database helper
function queryDatabase(db, sql, params = []) {
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

// Migrate categories
async function migrateCategories(db) {
  console.log("\n📂 Migrating categories...");

  try {
    const categories = await queryDatabase(
      db,
      "SELECT id, name, color, position FROM category ORDER BY position ASC"
    );

    if (categories.length === 0) {
      console.log("   No categories to migrate");
      return;
    }

    await fs.writeFile(
      categoriesFile,
      JSON.stringify(categories, null, 2),
      "utf-8"
    );

    console.log(
      `✓ Migrated ${categories.length} categories to ${categoriesFile}`
    );
  } catch (error) {
    console.error("❌ Error migrating categories:", error.message);
  }
}

// Migrate post-its
async function migratePostIts(db) {
  console.log("\n📝 Migrating post-its...");

  try {
    const postIts = await queryDatabase(
      db,
      `SELECT
        p.id,
        p.title,
        p.content,
        p.due_date,
        p.top_position,
        p.left_position,
        p.width,
        p.height,
        p.category_id,
        p.last_updated,
        p.minimized
      FROM post_it p
      ORDER BY p.id ASC`
    );

    if (postIts.length === 0) {
      console.log("   No post-its to migrate");
      return;
    }

    for (const postIt of postIts) {
      const frontMatter = {
        id: postIt.id,
        title: postIt.title || "New idea",
        dueDate: postIt.due_date || null,
        topPosition: postIt.top_position || 10,
        leftPosition: postIt.left_position || 10,
        width: postIt.width || 380,
        height: postIt.height || 240,
        categoryId: postIt.category_id || null,
        lastUpdated: postIt.last_updated || new Date().toISOString(),
        minimized: postIt.minimized || 0,
      };

      const content = postIt.content || "";
      const fileContent = matter.stringify(content, frontMatter);
      const filePath = path.join(contentsDir, `${postIt.id}.md`);

      await fs.writeFile(filePath, fileContent, "utf-8");
    }

    console.log(`✓ Migrated ${postIts.length} post-its to ${contentsDir}`);
  } catch (error) {
    console.error("❌ Error migrating post-its:", error.message);
  }
}

// Main migration function
async function migrate() {
  console.log("🚀 Starting migration from SQLite to file system...\n");

  // Check if database exists
  const hasDatabase = await checkDatabase();
  if (!hasDatabase) {
    return;
  }

  // Ensure contents directory
  await ensureContentsDir();

  // Open database
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error("❌ Error opening database:", err.message);
      process.exit(1);
    }
  });

  try {
    // Migrate data
    await migrateCategories(db);
    await migratePostIts(db);

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Verify the contents/ folder has your data");
    console.log("   2. Test the application to ensure everything works");
    console.log("   3. Once confirmed, you can safely delete just-post-it.db");
    console.log("   4. Users will need to reconfigure their preferences");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
  } finally {
    // Close database
    db.close((err) => {
      if (err) {
        console.error("❌ Error closing database:", err.message);
      }
    });
  }
}

// Run migration
migrate().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
