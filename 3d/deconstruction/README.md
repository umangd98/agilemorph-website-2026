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
- Render (about 45 minutes on an M1 Max):
  `Blender -b -P film.py -- desktop solid film/desktop 150 64`
  `Blender -b -P film.py -- desktop blue film/desktop-blue 150 12`
  `Blender -b -P film.py -- mobile solid film/mobile 150 48`
  `Blender -b -P film.py -- mobile blue film/mobile-blue 150 12`
- Then `python3 pack.py <path to this repo>` converts the frames to WebP in `public/deconstruction-v3/` and writes `desktop.json` and `mobile.json`.
