# Changelog

## Sat Jan 10 2026 (v2.0.5)

- chore: upgrade dependencies

## Mon Jan 5 2026 (v2.0.4)

- fix: add media query for increased font size on non-hover devices
- fix: remove min() from padding calculations in post-it content for consistent layout
- fix: remove min() from padding calculations in preview for consistent layout
- fix: update minHeight calculation for content to ensure proper resizing

## Sun Jan 4 2026 (v2.0.3)

- chore: upgrade dependencies
- fix: enable maximize button regardless of view mode
- fix: add scrollbar color for improved visibility in scrollable areas
- fix: prevent resize handles from displaying when maximized
- fix: update padding for maximized content and header for better layout
- fix: adjust preview header and content padding link to match maximized post-it styles

## Fri Dec 5 2025 (v2.0.2)

- chore: cleanup obsoletes v1 files
- chore: remove logs
- fix: prevent scroll on preview opening or closing
- feat: make preview an almost full screen dialog
- fix: add correct styles for links and anchors in preview

## Fri Dec 5 2025 (v2.0.1)

- fix: cleanup unused import

## Thu Dec 4 2025 (v2.0.0)

- feat: migrate storage from SQLite to file-based system
- feat: implement markdown preview with code blocks support thanks to shiki
- chore: add migration script and guide
- chore: upgrade dependencies

## Sat Oct 25 2025 (v1.1.4)

- chore: upgrade dependencies
- fix: remove eslint errors

## Sat Jul 26 2025 (v1.1.3)

- fix: un-maximize post-it before deleting so it restores body overflow
- chore: upgrade dependencies

## Wed Jul 23 2025

- docs(readme): update roadmap & cleanup readme
- feat: make post-it header not sticky when maximized

## Wed Jul 23 2025 (v1.1.2)

- feat: add font family user setting in preferences

## Wed Jul 23 2025 (v1.1.1)

- feat: make maximized post-it more immersive (zen mode)
- chore: add keyboard shortcut in un-maximize post-it button tooltip

## Wed Jul 23 2025 (v1.1.0)

- feat: make the app installable & add wide range of favicons
- chore: upgrade dependencies & bump v1.1.0

## Thu May 29 2025 (v1.0.8)

- feat: allow tab indent in post-it content
- fix: remove useless smooth scroll in post-it content
- chore: upgrade dependencies

## Tue May 27 2025

- refactor: fix eslint warnings in controls.tsx

## Mon May 26 2025 (v1.0.7)

- feat: add Saved! indicator when post-it is saved
- refactor: fix eslint warnings in controls.tsx
- fix: remove margin transition on post-it header
- fix: handle word break in url inside post-it

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
- refactor: replace intended console.log with console.info

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

- fix: remove invalid prop in post-it.tsx' Content component usage
- feat: add preferences pane in settings (theme, auto correct, spell-check)
- feat: add github repository link in about pane in settings and in package.json
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
