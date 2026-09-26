"""Sample roof-rich parts of the complete Basctdelm illustration.

This is an art-directed placement aid, not a claim of surveyed footprints.
It writes compact map percentages consumed by the walk scene. Run with
`python scripts/trace-basctdelm-roofs.py` from the repository root.
"""
from pathlib import Path
import json
import random

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
IMAGE = ROOT / "images/cities/basctdelm/basctdelm.png"
OUT = ROOT / "js/basctdelm-roofs.js"

BLOCKS = [
    ("high", [(9, 14), (19, 12), (27, 18), (29, 31), (22, 36), (11, 34)], 3.0),
    ("north", [(34, 16), (68, 14), (72, 22), (68, 31), (35, 30)], 2.05),
    ("central", [(32, 32), (64, 31), (65, 47), (35, 48)], 1.95),
    ("south", [(30, 53), (62, 54), (65, 68), (53, 78), (30, 77)], 2.1),
    ("south", [(17, 65), (29, 65), (31, 79), (18, 77)], 2.15),
    ("lower", [(72, 73), (89, 72), (96, 86), (83, 90), (69, 83)], 2.35),
    ("trade", [(72, 33), (78, 31), (81, 62), (74, 64)], 2.7),
    ("bellows", [(14, 47), (24, 47), (23, 69), (13, 68)], 2.1),
]


def main():
    image = cv2.imread(str(IMAGE))
    height, width = image.shape[:2]
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float32)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    # The inked roof ridges and edges produce much higher local variation than
    # the open plazas. Smooth over one house, then sample the resulting field.
    average = cv2.GaussianBlur(gray, (0, 0), 14)
    square = cv2.GaussianBlur(gray * gray, (0, 0), 14)
    detail = np.sqrt(np.maximum(0, square - average * average))
    detail = cv2.GaussianBlur(detail, (0, 0), 7)
    rng = random.Random(24680)
    chosen = []
    for zone, polygon, spacing in BLOCKS:
        polygon_px = np.array([(x * width / 100, y * height / 100) for x, y in polygon], np.int32)
        min_x, min_y = np.min(polygon_px, axis=0)
        max_x, max_y = np.max(polygon_px, axis=0)
        step = spacing * width / 100
        candidates = []
        for yy in np.arange(min_y, max_y, step):
            for xx in np.arange(min_x, max_x, step):
                px = int(xx + rng.uniform(-0.43, 0.43) * step)
                py = int(yy + rng.uniform(-0.43, 0.43) * step)
                if not (20 <= px < width - 20 and 20 <= py < height - 20):
                    continue
                if cv2.pointPolygonTest(polygon_px, (px, py), False) < 0:
                    continue
                value = float(detail[py, px])
                # Blue water, light paving and green park edge are poor house sites.
                hue, saturation, brightness = (int(v) for v in hsv[py, px])
                if 87 <= hue <= 130 and saturation > 45:
                    continue
                if 33 <= hue <= 83 and saturation > 48:
                    continue
                if brightness > 188 and saturation < 40:
                    continue
                candidates.append((value, px, py))
        # The low threshold admits weathered slate while rejecting empty plaza.
        for value, px, py in sorted(candidates, reverse=True):
            if value < 18:
                continue
            x, y = round(px / width * 100, 2), round(py / height * 100, 2)
            if zone == "high" and x < 24 and y < 27:
                continue  # Keep and its parade court
            if zone == "central" and 40 < x < 55 and 36 < y < 45:
                continue  # Open central square shown in the illustration
            if zone == "south" and 17 < x < 34 and 46 < y < 70:
                continue  # Griffonloch and Greenscape
            if any(other[2] == zone and (other[0] - x) ** 2 + (other[1] - y) ** 2 < (spacing * 0.74) ** 2 for other in chosen):
                continue
            chosen.append((x, y, zone))

    payload = json.dumps(chosen, separators=(",", ":"))
    OUT.write_text("// Roof-rich positions sampled from the full Basctdelm illustration.\n"
                   "window.BASCTDELM_ROOFS = " + payload + ";\n", encoding="utf-8")
    print(f"Wrote {len(chosen)} map-guided building positions to {OUT}")


if __name__ == "__main__":
    main()
