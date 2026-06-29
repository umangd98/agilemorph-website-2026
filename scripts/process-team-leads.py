#!/usr/bin/env python3
"""Process team lead portraits: edge-connected black-bg removal, watermark crop, equal framing."""
from __future__ import annotations

from collections import deque
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

# Shared portrait frame — all leads align to the same shoulder line and height.
REF_TOP = 44
REF_BOTTOM = 532
REF_H = REF_BOTTOM - REF_TOP

SOURCES = {
    "umang-dhandhania.png": ASSETS / "Umang_bg-50508c6b-6134-4bcd-a98f-fbd2f4ed4611.png",
    "kaustumbh-jaiswal.png": ASSETS / "Kaustumbh_bg-6ac12a52-1ed7-4fb8-86b7-70921877542a.png",
    "muskan-agrawal.png": ASSETS / "Muskan_bg-2cc5504b-985b-4f79-ac14-66f806d2621d.png",
}


def is_studio_black(r: float, g: float, b: float, threshold: float = 46.0) -> bool:
    brightness = (r + g + b) / 3.0
    sat = max(abs(r - g), abs(g - b), abs(r - b))
    return brightness < threshold and sat < 34.0


def remove_edge_black_bg(im: Image.Image, threshold: float = 46.0) -> Image.Image:
    """Remove only edge-connected studio black — preserves dark hair and clothing."""
    im = im.convert("RGBA")
    data = np.array(im)
    h, w = data.shape[:2]
    rgb = data[..., :3].astype(np.float32)
    alpha = data[..., 3].astype(np.float32)

    removable = np.zeros((h, w), dtype=bool)
    for y in range(h):
        for x in range(w):
            if alpha[y, x] < 10:
                continue
            r, g, b = rgb[y, x]
            if is_studio_black(r, g, b, threshold):
                removable[y, x] = True

    connected = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def try_enqueue(x: int, y: int) -> None:
        if x < 0 or x >= w or y < 0 or y >= h:
            return
        if not removable[y, x] or connected[y, x]:
            return
        connected[y, x] = True
        queue.append((x, y))

    for x in range(w):
        try_enqueue(x, 0)
        try_enqueue(x, h - 1)
    for y in range(h):
        try_enqueue(0, y)
        try_enqueue(w - 1, y)

    while queue:
        x, y = queue.popleft()
        try_enqueue(x - 1, y)
        try_enqueue(x + 1, y)
        try_enqueue(x, y - 1)
        try_enqueue(x, y + 1)

    data[connected, 3] = 0
    return Image.fromarray(data)


def erase_watermark_pixels(im: Image.Image) -> Image.Image:
    """Remove bright Gemini watermark pixels in bottom corners."""
    im = im.convert("RGBA")
    data = np.array(im)
    h, w = data.shape[:2]
    rgb = data[..., :3].astype(np.float32)
    bright = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    y_cut = int(h * 0.82)
    corner_mask = np.zeros((h, w), dtype=bool)
    corner_mask[y_cut:, :120] = True
    corner_mask[y_cut:, w - 120 :] = True
    mark = corner_mask & (bright > 120) & (sat < 55) & (data[..., 3] > 0)
    data[mark, 3] = 0
    return Image.fromarray(data)


def defringe_alpha(im: Image.Image, min_alpha: int = 200) -> Image.Image:
    """Snap near-opaque edge pixels to full opacity to avoid light-mode halos."""
    im = im.convert("RGBA")
    data = np.array(im)
    alpha = data[..., 3]
    solid = alpha >= min_alpha
    data[solid, 3] = 255
    return Image.fromarray(data)


def apply_bottom_arc(im: Image.Image, edge_lift: int = 38, fade: int = 14) -> Image.Image:
    """Convex bottom curve for portrait cards."""
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


def fit_to_canvas(im: Image.Image) -> Image.Image:
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


def apply_rembg_mask(im: Image.Image) -> Image.Image:
    """Use rembg segmentation while preserving original subject colors."""
    im = im.convert("RGBA")
    buffer = BytesIO()
    im.save(buffer, format="PNG")
    cutout = Image.open(BytesIO(rembg_remove(buffer.getvalue()))).convert("RGBA")
    data = np.array(im)
    mask = np.array(cutout)[..., 3]
    data[..., 3] = mask
    return Image.fromarray(data)


def process_portrait(src: Path) -> Image.Image:
    raw = Image.open(src).convert("RGBA")
    cutout = apply_rembg_mask(raw)
    cutout = erase_watermark_pixels(cutout)
    cutout = defringe_alpha(cutout)
    fitted = fit_to_canvas(cutout)
    arced = apply_bottom_arc(fitted)
    return erase_watermark_pixels(arced)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for name, src in SOURCES.items():
        if not src.exists():
            raise FileNotFoundError(f"Missing source image: {src}")
        image = process_portrait(src)
        path = OUT / name
        image.save(path)
        print(f"wrote {path.name} {image.size} bbox={image.getbbox()}")


if __name__ == "__main__":
    main()
