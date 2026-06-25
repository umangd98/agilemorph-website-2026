#!/usr/bin/env python3
"""Process team lead portraits: bg removal, Kaustumbh framing, bottom arc crop."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import remove as rembg_remove

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(
    "/Users/satvik/.cursor/projects/Users-satvik-Downloads-projects-agilemorph-agilemorph-site/assets"
)
OUT = ROOT / "media" / "team-leads"
CANVAS = (480, 560)

REF = Image.open(ROOT / "public/team/kaustumbh-jaiswal.png").convert("RGBA")
REF_BBOX = REF.getbbox()
assert REF_BBOX is not None
REF_TOP, REF_BOTTOM = REF_BBOX[1], REF_BBOX[3]
REF_H = REF_BOTTOM - REF_TOP


def strip_checkerboard(im: Image.Image) -> Image.Image:
    """Remove fake transparency grids baked into exported PNGs."""
    im = im.convert("RGBA")
    data = np.array(im, dtype=np.float32)
    r, g, b, a = data[..., 0], data[..., 1], data[..., 2], data[..., 3]
    neutral = (np.abs(r - g) < 10) & (np.abs(g - b) < 10)
    checker = neutral & (((np.abs(r - 204) < 14) & (a > 40)) | ((r > 245) & (a > 40)))
    data[..., 3] = np.where(checker, 0, a)
    return Image.fromarray(data.astype(np.uint8))


def remove_neutral_bg(im: Image.Image, brightness: float = 200, sat_max: float = 35) -> Image.Image:
    im = im.convert("RGBA")
    data = np.array(im, dtype=np.float32)
    rgb = data[..., :3]
    alpha = data[..., 3].copy()
    brightness_map = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    soft = np.clip((brightness_map - (brightness - 40)) / 40, 0, 1)
    soft = np.where((brightness_map > brightness - 40) & (sat < sat_max + 15), soft, 0)
    alpha = alpha * (1 - soft)
    data[..., 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    return Image.fromarray(data.astype(np.uint8))


def apply_bottom_arc(im: Image.Image, edge_lift: int = 38, fade: int = 14) -> Image.Image:
    """Convex bottom curve matching Muskan portrait style."""
    im = im.convert("RGBA")
    data = np.array(im)
    h, w = data.shape[:2]
    alpha = data[:, :, 3].astype(np.float32)
    cx = w / 2
    ys = np.arange(h, dtype=np.float32)[:, None]
    xs = np.arange(w, dtype=np.float32)[None, :]
    nx = (xs - cx) / (w / 2)
    cut_y = (h - 1) - edge_lift * (nx**2)
    factor = np.clip((cut_y - ys) / fade, 0, 1)
    data[:, :, 3] = np.clip(alpha * factor, 0, 255).astype(np.uint8)
    return Image.fromarray(data)


def fit_like_kaustumbh(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    bbox = im.getbbox()
    if not bbox:
        return Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    person = im.crop(bbox)
    scale = REF_H / person.height
    new_w, new_h = int(person.width * scale), int(person.height * scale)
    person = person.resize((new_w, new_h), Image.Resampling.LANCZOS)
    if person.height > REF_H:
        person = person.crop((0, 0, person.width, REF_H))
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    x = (CANVAS[0] - person.width) // 2
    y = max(REF_TOP, REF_BOTTOM - person.height)
    canvas.paste(person, (x, y), person)
    return canvas


def process_umang() -> Image.Image:
    src = ASSETS / "Image-1700a6bf-30dc-4e7a-8116-983b7c1efed4.png"
    raw = strip_checkerboard(Image.open(src))
    buffer = BytesIO()
    raw.save(buffer, format="PNG")
    cutout = Image.open(BytesIO(rembg_remove(buffer.getvalue()))).convert("RGBA")
    im = fit_like_kaustumbh(cutout)
    return apply_bottom_arc(im)


def process_kaustumbh() -> Image.Image:
    im = Image.open(ROOT / "public/team/kaustumbh-jaiswal.png").convert("RGBA")
    im = fit_like_kaustumbh(im)
    return apply_bottom_arc(im)


def process_muskan() -> Image.Image:
    src = ASSETS / "Gemini_Generated_Image_qrgxx7qrgxx7qrgx-89e444f7-a72d-4d8c-8335-2e8c9707727d.png"
    im = remove_neutral_bg(Image.open(src), brightness=175, sat_max=35)
    im = fit_like_kaustumbh(im)
    return apply_bottom_arc(im)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    outputs = {
        "umang-dhandhania.png": process_umang(),
        "kaustumbh-jaiswal.png": process_kaustumbh(),
        "muskan-agrawal.png": process_muskan(),
    }
    for name, image in outputs.items():
        path = OUT / name
        image.save(path)
        print(f"wrote {path.name} {image.size} bbox={image.getbbox()}")


if __name__ == "__main__":
    main()
