# Changelog

## Mon May 26 2025

- refactor: fix eslint warnings in controls.tsx

## Sun May 25 2025 (v1.0.6)

- refactor: move header actions in post-it footer
- feat: add minimize & maximize actions in post-it header
- fix: un maximize post-it on escape key press
- fix: add correct z-index to post-it when maximized
- refactor: rename functions + disable minimize & maximize buttons while grid mode is enabled
- docs(readme): update roadmap + add changelog

## Sat May 24 2025 (v1.0.5)

- fix: disable main controls keyboard shortcuts while editing a note
- refactor: update favicon
- refactor: increase post-it content bottom padding
- chore: upgrade dependencies
- chore: cleanup obsolete props in post-it.tsx
- refactor: revamp app loader > replace bar with real bottom left loader
- feat: add cmd|ctrl+s keyboard shortcut for saving post-its
- fix: blur focused post-it on Escape key press

## Tue Apr 29 2025

- chore: upgrade jt-design-system
- fix: close post-it remove popover on post-it deletion
- fix: disconnect icon intersection observer when inView
- chore: cleanup unused Icons library component

## Mon Apr 28 2025

- fix: improve post-it placeholder styles
- fix: disable post-it animations while dragging
- fix: disable post-it animations while resizing
- fix: add post-it exit animation when filtering post-its

## Sun Apr 27 2025 (V1.0.4)

- fix: remove unused import in pad component
- feat: animate post-it creation
- feat: add post-it ghost placeholder while dragging new post-it button
- feat: allow user to hide keyboard shortcuts in preferences
- fix: add horizontal hidden overflow to main container
- refactor: replace intented console.log with console.info

## Sat Apr 26 2025

- fix: move keyboard shortcut prevent default

## Fri Apr 25 2025

- fix: round values when resizing post-it
- feat: show loader on preference change
- feat: add controls keyboard shortcuts

## Fri Apr 25 2025 (v1.0.3)

- fix: login page
- fix: update script in package.json
- chore: update dependencies
- docs(readme): fix install documentation

## Tue Apr 24 2025 (v1.0.2)

- fix: remove unvalid prop in post-it.tsx' Content component usage
- feat: add preferences pane in settings (theme, auto correct, spell-check)
- feat: add githup repository link in about pane in settings and in package.json
- refactor: minor cleanup
- docs(readme): update roadmap

## Wed Apr 23 2025 (v1.0.1)

- chore: upgrade dependencies
- chore: enable react-compiler
- chore: replace framer-motion with motion
- chore: replace dt-design-system with jt-design-system
- chore: Update nanoid and tar-fs package versions
- chore/refactor: add lazy loading for all icons + import icons from remix icons

## Wed Nov 6 2024 (v1.0.0)

- feat: add settings module with category manager
- chore: upgrade dependencies
- fix: adjust category manager color indicator width
- feat: auto focus post-it title on creation

## Sat Oct 26 2024

- refactor: improve dark theme

## Thu Oct 24 2024

- feat: add category POST, PATCH & DELETE endpoints
- chore: move database scripts inside database folder
- chore: update package-lock.json
- refactor: remove 'Content' string from default for content

## Wed Oct 23 2024 (v0.1.1)

- refactor: improve post-it resize behavior
- refactor: merge all post-it updates in an unique partial route
- chore: upgrade to Next.js 15
- chore: remove useless logs

## Tue Oct 15 2024 (v0.1.0)

- docs(readme): update installation & launch procedure
- docs(readme): add app preview
- chore(env): cleanup env example file
- docs(readme): add configuration step
- fix: cleanup obsolete import in post-it/header
- refactor: cleanup + merge post-it actions inside dropdown menu
- docs(readme): update roadmap
- chore: upgrade design-system dependency
- docs(readme): update roadmap
- docs(changelog): add changelog
- docs(readme): update roadmap & installation procedure
- initial commit
