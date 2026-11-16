"""Turn the rendered PNG frames into WebP for the site and write each variant's manifest."""
import json, os, sys, glob
from PIL import Image
SITE = sys.argv[1]
VARIANTS = sys.argv[2:] or ["desktop", "mobile"]
OUT = os.path.join(SITE, "public", "deconstruction-v3")
os.makedirs(OUT, exist_ok=True)
for variant in VARIANTS:
    q = 74 if variant == "desktop" else 70
    a = json.load(open(f"film/{variant}/anchors.json"))
    for sub in (variant, f"{variant}-blue", f"{variant}-loop"):
        dst = os.path.join(OUT, sub)
        for old in glob.glob(os.path.join(dst, "*.webp")): os.remove(old)
        os.makedirs(dst, exist_ok=True)
        for f in sorted(glob.glob(f"film/{sub}/*.png")):
            Image.open(f).convert("RGB").save(os.path.join(dst, os.path.basename(f)[:-4] + ".webp"), "WEBP", quality=q, method=5)
    blue = sorted(int(os.path.basename(f)[:4]) for f in glob.glob(f"film/{variant}-blue/*.png"))
    loop = len(glob.glob(f"film/{variant}-loop/*.png"))
    json.dump(dict(frames=a["frames"], loop=loop, res=a["res"], blue=blue, anchors=a["anchors"]), open(os.path.join(OUT, f"{variant}.json"), "w"), separators=(",", ":"))
    print(variant, a["frames"], "frames,", len(blue), "blueprint,", loop, "loop")
