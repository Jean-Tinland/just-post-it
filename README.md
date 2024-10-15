# It's Just Post-It

Just Post-It is a simple note-taking app aiming to provide a novel experience by allowing the user to just drop notes on a free canvas.

## General notice

As this is a fork from a personal project presented [here](https://www.jeantinland.com/portfolio/draft-pad/) and detailed [in this blog post](https://www.jeantinland.com/blog/the-ultimate-note-app/), some basic features still need to be implemented before production use.

## Roadmap

Here are the planned features:

- Full description of all available features
- Category manager UI
- Settings UI
- About pane in settings with product version and “Update available” indicator in settings
- Full i18n support (translations, reading direction, …)
- Keyboard shortcuts
- Global export
- Improve app responsive
- Make the app installable
- Changelog
- Global code refactoring
- Demo website based on the real app
- …?

This list is non-exhaustive and expected to evolve.

## Dependencies & requirements

- npm
- node >= 18
- pm2

## Installation

Once you installed npm, node and pm2, follow these instructions.

```bash
# Clone this repo on your server in the desired location
git clone https://github.com/Jean-Tinland/just-post-it

# Go to the cloned folder
cd ./just-post-it

# This command will init the database
npm run init
```

Just Post-It is now ready to run.

## Launching the app

Still in the `just-post-it` folder:

```bash
# This will start the app in the background with pm2
npm run launch
```

> [!TIP]
> Once you launched `just-post-it`, pm2 will tell you that the process list is not saved. You can run `pm2 save` command in order to save the pm2 process list. The saved process will be automaticaly restarted if your server is restarted.
