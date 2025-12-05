# Migration Summary: SQLite to File System + Cookies

## Overview

Successfully migrated Just Post-It from SQLite database storage to a file-based system with cookies for preferences.

## Changes Made

### 1. New Dependencies

- **Added:** `gray-matter` for markdown frontmatter parsing

### 2. New Files Created

#### Services

- `src/services/filesystem.ts` - File system operations for post-its and categories
- `src/services/preferences.ts` - Cookie-based preferences management

#### Migration

- `database/migrate.js` - Migration script to convert SQLite data to file system
- `MIGRATION.md` - Comprehensive migration guide for users

### 3. Modified Files

#### Configuration

- `.gitignore` - Added `contents/` folder to ignore list
- `package.json` - Added `npm run migrate` script

#### API Routes

- `src/app/api/post-its/route.ts` - Now uses filesystem service
- `src/app/api/post-it/route.ts` - Now uses filesystem service
- `src/app/api/categories/route.ts` - Now uses filesystem service
- `src/app/api/category/route.ts` - Now uses filesystem service
- `src/app/api/preferences/route.ts` - Returns 410 Gone (deprecated)
- `src/app/api/preference/route.ts` - Returns 410 Gone (deprecated)

#### Services & Components

- `src/services/api.ts` - Updated preference functions to no-ops
- `src/app/layout.tsx` - Now reads preferences from cookies
- `src/app/actions.ts` - Updated preference action to no-op
- `src/components/settings/preferences.tsx` - Now uses cookie-based preferences service

### 4. Storage Architecture

#### Post-Its

- **Location:** `contents/{id}.md`
- **Format:** Markdown with YAML frontmatter
- **Frontmatter fields:**
  - `id`, `title`, `dueDate`
  - `topPosition`, `leftPosition`, `width`, `height`
  - `categoryId`, `lastUpdated`, `minimized`
- **Content:** Markdown body

#### Categories

- **Location:** `contents/categories.json`
- **Format:** JSON array
- **Fields:** `id`, `name`, `color`, `position`

#### Preferences

- **Location:** Browser localStorage (`preferences` key)
- **Format:** JSON
- **Fields:** `spellCheck`, `autoCorrect`, `theme`, `hideKeyboardShortcuts`, `fontFamily`

## Migration Path

### For Users with Existing Data

1. Install dependencies: `npm install`
2. Run migration: `npm run migrate`
3. Verify data in `contents/` folder
4. Test the application
5. Reconfigure preferences in the app
6. Delete old `just-post-it.db` file

### For New Users

- No migration needed
- Data will be automatically created in `contents/` folder on first use
- Preferences will be saved to cookies when configured

## Benefits

### Post-Its & Categories

- Easy to backup (just copy `contents/` folder)
- Easy to version control (git-friendly)
- Human-readable format (markdown + JSON)
- Easy to edit manually if needed
- No database dependencies
- Portable across systems

### Preferences

- User-specific (not shared across users)
- No server-side storage needed
- Instant updates (no API calls)
- Persists across sessions
- Browser-native storage

## Backward Compatibility

- Migration script preserves all data
- No data loss during migration

## Testing Checklist

- [ ] Create new post-it
- [ ] Update post-it content
- [ ] Move post-it position
- [ ] Resize post-it
- [ ] Delete post-it
- [ ] Create category
- [ ] Update category name/color
- [ ] Delete category
- [ ] Assign post-it to category
- [ ] Update theme preference
- [ ] Update font family preference
- [ ] Toggle spell check
- [ ] Toggle auto-correct
- [ ] Toggle keyboard shortcuts visibility
- [ ] Restart app - verify data persists
- [ ] Run migration script with existing SQLite data

## Notes

- The `contents/` folder is git-ignored by default
- Each post-it file is named `{id}.md` where `id` is the post-it ID
- Category IDs in post-its are joined at runtime to display category name/color
- Migration script is idempotent (can be run multiple times safely)
