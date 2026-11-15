# Deconstruction 3D kit

Source for `public/deconstruction/kit.glb`, the models behind `/deconstruction-v2`.

- `kit.py` builds every part in Blender and exports one Draco-compressed GLB with each part named (see the docstring for the names the page looks up).
- `testframe.py` renders the still used as the page's poster and fallback.
- `screen*.png` are the dashboard textures on the team screens.

Rebuild (Blender 5.x):

1. Put `InterTight.ttf` (Google Fonts, OFL) next to the scripts. `testframe.py` also needs `studio.hdr` (Poly Haven `studio_small_09`, CC0).
2. `/Applications/Blender.app/Contents/MacOS/Blender -b -P kit.py -- ../../public/deconstruction/kit.glb`
3. For the poster: `Blender -b -P testframe.py -- final.png 192 1920 1080`, then save it as `public/deconstruction/poster.webp` at 1600 x 900.
