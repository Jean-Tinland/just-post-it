# It's Just Post-It

_Just Post-It_ is a simple note-taking app aiming to provide a novel experience by allowing the user to just drop notes on a free canvas.

[Changelog](./CHANGELOG.md) | [Migration Guide v1 to v2](./MIGRATION.md)

<p align="center">
  <img src="./public/images/preview.jpg" width="600" />
</p>

## General notice

As this is a fork from a personal project presented [here](https://www.jeantinland.com/portfolio/draft-pad/) and detailed [in this blog post](https://www.jeantinland.com/blog/the-ultimate-note-app/), some basic features still need to be implemented before production use.

## Storage Architecture

_Just Post-It_ uses a **file-based storage system**:

- **Notes** are stored as `.md` files with frontmatter in the `contents/` folder
- **Categories** are stored in `contents/categories.json`
- **Preferences** are stored in the browser's localStorage (client-side)

This approach makes your data:

- Easy to backup (just copy the `contents/` folder)
- Version control friendly
- Human-readable and editable
- Portable across systems

## Roadmap

Here are the planned features:

- Full description of all available features
- Full i18n support (translations, reading direction, …)
- Global export of post-it
- Improve app responsive
- Demo website based on the real app
- …?

This list is non-exhaustive and expected to evolve.

## Dependencies & requirements

- npm
- node >= 18.18
- pm2

## Installation

Once you installed npm, node and pm2, follow these instructions.

```bash
# Clone this repo on your server in the desired location
git clone https://github.com/Jean-Tinland/just-post-it

# Go to the cloned folder
cd ./just-post-it

# Install dependencies
npm install
```

> [!NOTE]
> The `contents/` folder will be automatically created when you start using the app. No database initialization is required.

## Configuration

```bash
# Duplicate the .env example
cp .env.example .env
```

Fill in the required information inside your .env:

```env
PROD_URL=https://your-production-url.com # the production url of your app
PORT=4000 # the port used by the app
JWT_SECRET=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx # the jwt secret, it can be anything like an UUID
JWT_DURATION=90 # the jwt token duration in days
PASSWORD=xxxxxxxx # your password
```

_Just Post-It_ is now ready to run.

## Launching the app

Still in the `just-post-it` folder:

```bash
# This will start the app in the background with pm2
npm run launch
```

You can use either Apache or nginx to setup _Just Post-It_ and make it accessible from the web.

> [!TIP]
> Once you launched `just-post-it`, pm2 will tell you that the process list is not saved. You can run `pm2 save` command in order to automaticaly restart all pm2 processes if your server is restarted.

## Updating the app

```bash
# This will stop the app, pull the latest changes and relaunch it
npm run update
```

> [!WARNING]
> Your Just Post-It app will be down during the update.

## Migrating from SQLite

If you're upgrading from a version that used SQLite, run the migration script:

```bash
npm run migrate
```

This will convert your existing data to the new file-based format. See the [Migration Guide](./MIGRATION.md) for detailed instructions.

## Backup & Restore

### Backing up your data

Simply copy the `contents/` folder to back up all your notes and categories:

```bash
# Create a backup
cp -r contents/ contents-backup-$(date +%Y%m%d)/
```

### Restoring from backup

Copy your backed-up `contents/` folder back to the application directory:

```bash
# Restore from backup
cp -r contents-backup-20250204/ contents/
```

> [!TIP]
> You can also use git to version control your `contents/` folder by removing it from `.gitignore`, though this will make your notes public in your repository.
