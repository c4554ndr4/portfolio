# Developing the dungeon portfolio

The site uses Astro for pages and content, and Phaser for the game. The deployment workflow uses Node 20.

```sh
npm ci
npm run dev
```

The development server normally starts at `http://localhost:4321/portfolio/`. Follow the URL printed by the server.

| Command | Purpose |
|---|---|
| `npm run dev` | Start local development |
| `npm run build` | Build site pages and the game bundle |
| `npm run build:game` | Build only the game bundle |
| `npm run preview` | Preview the production build |

## Game and navigation

`src/game/main.ts` contains the scene, input handling, movement, collisions, projectile behavior, portal feedback, and transition logic. `src/game/entry.ts` is the game entry point; `src/pages/index.astro` hosts the canvas and direct Link View.

Portal objects embedded in the selected map take precedence over the fallback list in `src/game/portals.ts`. Each configured portal includes an ID, title, URL, and position. Relative destinations are resolved against the deployment base: `writeups/example/` becomes `/portfolio/writeups/example/` on GitHub Pages. Update the separate Link View when changing its writing or project index.

## Room maps

The current default map is `public/assets/room-cute-rich.tmj`. Available variants include:

- `?map=alt`: `room-alt.tmj`
- `?map=cute`: `room-cute.tmj`
- `?map=cute-rich`: `room-cute-rich.tmj`

Edit the selected map in Tiled and preserve the layer/object names expected by the scene. The map uses `Room` tiles and may include `Decor`, `Spawn`, and `Portals` object layers. `Spawn` can contain a `player` object. Decorative objects use sprite keys or properties interpreted by the scene. Historical `room.tmx` and `room-alt.tmx` files are also included; changing those alone does not change the default map.

The optional glow/shimmer effects can be disabled with `?fx=off`; combine this with other query parameters using `&`.

## Writing

Add Markdown under `src/content/writeups` using the schema in `src/content/config.ts`. A typical published entry is:

```md
---
title: "Project title"
description: "A short introduction"
date: 2026-09-23
status: published
---

The project write-up goes here.
```

## Assets

The scene loads assets from `public/assets`, including player and portal spritesheets, a fireball animation, map tiles, and decorative props. Keep filenames, frame dimensions, and map references consistent with the loader in `src/game/main.ts`. Refer to the README credits and each asset pack's license before reusing or redistributing artwork.

## Deployment

The live dungeon is hosted at `https://c4554ndr4.github.io/portfolio/`. `.github/workflows/deploy.yml` builds and deploys pushes to `main` through GitHub Pages. A deployment-path change must be reflected in `astro.config.mjs`, `vite.config.ts`, and `vite.game.config.ts`.

For interaction changes, check movement and collision boundaries, keyboard and pointer projectiles, portal transitions, direct Link View, and returning from a linked page. The screenshot in `docs/screenshots/dungeon-room.png` shows the live dungeon. Update it when the interface changes materially.
