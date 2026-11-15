# Deconstruction 3D kit

Source for `public/deconstruction/kit.glb`, the models behind `/deconstruction-v2`.

- `kit.py` builds every part in Blender and exports one Draco-compressed GLB with each part named (see the docstring for the names the page looks up).
- `testframe.py` renders the still used as the page's poster and fallback.
- `screen*.png` are the dashboard textures on the team screens.

Rebuild (Blender 5.x):

1. Put `InterTight.ttf` (Google Fonts, OFL) next to the scripts. `testframe.py` also needs `studio.hdr` (Poly Haven `studio_small_09`, CC0).
2. `/Applications/Blender.app/Contents/MacOS/Blender -b -P kit.py -- ../../public/deconstruction/kit.glb`
3. For the poster: `Blender -b -P testframe.py -- final.png 192 1920 1080`, then save it as `public/deconstruction/poster.webp` at 1600 x 900.

## /deconstruction-v3: the department engine film

- `film.py` builds the engine once and renders the whole story as a frame sequence, plus the anchor points the page uses for labels and the process ring. `bp.py` turns a scene into the line-drawn blueprint.
- Department names sit on a dial ring on the floor, curved along it, with a big icon on each wedge. The team facing the camera lights green. `LABELS=<style>` switches to the other trial styles (top, wall, icons, ring, colour, plain).
- Render (about an hour on an M1 Max). `loop` is the opening shot: one full turn of the closed engine, played on repeat until the visitor scrolls.
  `Blender -b -P film.py -- desktop solid film/desktop 150 48`
  `Blender -b -P film.py -- desktop blue film/desktop-blue 150 12`
  `Blender -b -P film.py -- desktop loop film/desktop-loop 60 48`
  `Blender -b -P film.py -- mobile solid film/mobile 150 40`
  `Blender -b -P film.py -- mobile blue film/mobile-blue 150 12`
  `Blender -b -P film.py -- mobile loop film/mobile-loop 60 40`
- Then `python3 pack.py <path to this repo>` converts the frames to WebP in `public/deconstruction-v3/` and writes `desktop.json` and `mobile.json` (frames, blueprint frames, loop length and label anchors).

## /deconstruction-three: the same engine, live

- `Blender -b -P film.py -- desktop glb <outdir> 1 1` joins the closed engine into one mesh, bakes its contact shading (`ao.png`, on a second UV map) and the floor's light and shadow (`floor.exr`), and exports `engine.glb` with Draco.
- For the site: `ao.png` goes to `public/deconstruction-three/ao.webp` at 2048 px, grayscale. `floor.exr` is divided by the open floor's brightness, clipped at 1.6, scaled to 0 to 1 and saved as `floor-light.webp` at 1024 px.
- Lights, the team spotlight and the green spill are live in `src/components/deconstruction-three/engine3d.ts`.
