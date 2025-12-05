# Migration Guide: SQLite to File System

This guide will help you migrate your Just Post-It data from the SQLite database to the new file-based storage system.

## What Changed?

### 1. **Post-Its Storage**

- **Before:** Stored in SQLite `post_it` table
- **After:** Each post-it is stored as a `.md` file in the `contents/` folder with frontmatter metadata

### 2. **Categories Storage**

- **Before:** Stored in SQLite `category` table
- **After:** All categories are stored in `contents/categories.json`

### 3. **Preferences Storage**

- **Before:** Stored in SQLite `preference` table
- **After:** Stored in browser localStorage (client-side)

## Migration Steps

### Step 1: Install Dependencies

Make sure you have the latest dependencies installed:

```bash
npm install
```

### Step 2: Run the Migration Script

Run the migration script to convert your SQLite data to the file system:

```bash
npm run migrate
```

This script will:

- Create the `contents/` folder if it doesn't exist
- Convert all post-its to `.md` files with frontmatter
- Export all categories to `contents/categories.json`
- Display your current preferences (for manual reconfiguration)

### Step 3: Verify the Migration

1. Check the `contents/` folder to ensure your data has been migrated
2. Look for `.md` files (one per post-it)
3. Check `contents/categories.json` for your categories

### Step 4: Test the Application

Start the application and verify everything works:

```bash
npm run dev
```

### Step 5: Reconfigure Preferences

Since preferences are now stored in browser localStorage, you'll need to reconfigure them in the app:

1. Open the app in your browser
2. Go to Settings → Preferences
3. Reconfigure your preferences (theme, font family, spell check, etc.)

### Step 6: Clean Up (Optional)

Once you've verified that everything works correctly, you can safely delete the old database file:

```bash
rm just-post-it.db
```

## File Structure

### Post-It File Format

Each post-it is stored as a `.md` file with the following structure:

```markdown
---
id: 1
title: "My Note"
dueDate: "2025-12-31T00:00:00.000Z"
topPosition: 100
leftPosition: 200
width: 380
height: 240
categoryId: 1
lastUpdated: "2025-12-04T10:30:00.000Z"
minimized: 0
---

This is the content of my note.
It supports **markdown** formatting!
```

### Categories File Format

Categories are stored in `contents/categories.json`:

```json
[
  {
    "id": 1,
    "name": "Work",
    "color": "blue",
    "position": 0
  },
  {
    "id": 2,
    "name": "Personal",
    "color": "green",
    "position": 1
  }
]
```

## Troubleshooting

### Migration Script Fails

If the migration script fails:

1. Check that `just-post-it.db` exists in your project root
2. Make sure you have the `gray-matter` package installed
3. Check the error message for specific issues

### Missing Data After Migration

If some data is missing:

1. Check the migration script output for errors
2. Manually verify the `contents/` folder
3. Re-run the migration script (it will overwrite existing files)

### Preferences Not Working

Preferences are now stored in browser localStorage:

1. Clear your browser localStorage for the app (F12 → Application → Local Storage)
2. Reconfigure preferences in the app settings
3. Make sure your browser supports localStorage

## Reverting to SQLite (Not Recommended)

If you need to revert to the SQLite version:

1. Checkout the previous commit before the migration
2. Restore your `just-post-it.db` backup (if you have one)
3. Run `npm install` to restore dependencies

## Support

If you encounter any issues during migration, please:

1. Check the troubleshooting section above
2. Review the migration script output for error messages
3. Open an issue on the GitHub repository with details
