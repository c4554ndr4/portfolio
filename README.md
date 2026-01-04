# Cassandra Portfolio Dungeon

Astro + Phaser-powered one-room pixel dungeon that serves as the blog index.

## Local dev

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build the production site + dungeon bundle |
| `npm run build:game` | Build only the dungeon bundle |
| `npm run preview` | Preview the production build |

## Portals

Edit `src/game/portals.ts` to add or move portals. Each portal needs `id`, `title`, `url`, `x`, and `y` (pixel coordinates).

Relative URLs are resolved against the base path, so `writeups/example/` becomes `/portfolio/writeups/example/` on GitHub Pages.

## Room layout (Tiled)

Edit `public/assets/room.tmx` in the Tiled editor, then export JSON to `public/assets/room.tmj`. The map uses:
- one tile layer named `Room`
- an object layer named `Decor` for sprite props (object `name` = sprite key)
- an object layer named `Spawn` with a `player` object for the player start

To preview the alternate test map, use `?map=alt` (loads `public/assets/room-alt.tmj`). The editable TMX is `public/assets/room-alt.tmx`.

## Optional shader overlay

The glow/shimmer overlay can be disabled by adding `?fx=off` to the URL.

## Assets

Drop sprite assets into `public/assets/` with these filenames:

- `public/assets/tiles.png` — tilesheet, 2 tiles wide by 1 tile tall, 16x16 per tile.
- `public/assets/player.png` — spritesheet, 5 frames, 16x18 per frame (mage walk cycle, mirrored for left).
- `public/assets/portal.png` — spritesheet, 8 frames, 64x64 per frame.
- `public/assets/fireball.png` — spritesheet, 12 frames, 16x16 per frame (used for spacebar projectile).
- Optional decor sprites live in `public/assets/decor/` (bookshelves, books, lamps).

These files currently use assets from the user-provided MiniRogue pack (tiles/player) and Elthen's portal sprites (portal).

Suggested free packs with a similar vibe:
- Kenney Tiny Dungeon (CC0)
- 0x72 Dungeon Tileset II (CC0)
- Pixel Frog Tiny Dungeon (CC0)

## Writeups

Add markdown files to `src/content/writeups`. Each file should include frontmatter:

```md
---
title: "Title"
description: "Short summary"
date: 2024-01-12
status: published
---

Your content here.
```

## GitHub Pages

This site is configured for the `portfolio` repository under `https://c4554ndr4.github.io/portfolio/`.

If you change the repo name, update:
- `astro.config.mjs` `base` and `site`
- `vite.config.ts` `base`
- `vite.game.config.ts` `base`

Deployment is handled by `.github/workflows/deploy.yml`.
