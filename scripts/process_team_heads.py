
"""
Process team images by removing background and cropping the head region.

Dependencies (install as needed):
  pip install pillow numpy rembg mediapipe opencv-python
"""

from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
import io
from pathlib import Path
from typing import Iterable, Optional, Tuple

import numpy as np
from PIL import Image


@dataclass
class CropConfig:
    # Padding factors relative to face bounding box
    pad_top: float = 0.65
    pad_bottom: float = 0.35
    pad_left: float = 0.35
    pad_right: float = 0.35
    min_face_ratio: float = 0.08  # face bbox width or height / image dimension


def _iter_images(input_dir: Path) -> Iterable[Path]:
    for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp", "*.bmp"):
        yield from input_dir.glob(ext)


def _safe_mkdir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def _remove_bg(img: Image.Image) -> Image.Image:
    try:
        from rembg import remove  # type: ignore
    except Exception as exc:  # pragma: no cover - runtime dependency
        raise RuntimeError(
            "Background removal requires `rembg`. Install with `pip install rembg`."
        ) from exc

    # rembg expects bytes; keep alpha if present
    result = remove(img.convert("RGBA"))
    if isinstance(result, Image.Image):
        return result.convert("RGBA")
    if isinstance(result, (bytes, bytearray)):
        return Image.open(io.BytesIO(result)).convert("RGBA")
    raise RuntimeError("Unexpected rembg output type.")


def _detect_face_mediapipe(img: Image.Image) -> Optional[Tuple[int, int, int, int]]:
    try:
        import mediapipe as mp  # type: ignore
    except Exception:
        return None

    # Some mediapipe builds (e.g., tasks-only) don't expose solutions.
    if not hasattr(mp, "solutions"):
        return None

    mp_fd = mp.solutions.face_detection
    img_rgb = np.array(img.convert("RGB"))
    h, w, _ = img_rgb.shape
    with mp_fd.FaceDetection(model_selection=1, min_detection_confidence=0.5) as fd:
        results = fd.process(img_rgb)
        if not results.detections:
            return None
        # pick largest face
        best = None
        best_area = 0
        for det in results.detections:
            bbox = det.location_data.relative_bounding_box
            x = int(bbox.xmin * w)
            y = int(bbox.ymin * h)
            bw = int(bbox.width * w)
            bh = int(bbox.height * h)
            area = max(bw, 0) * max(bh, 0)
            if area > best_area:
                best_area = area
                best = (x, y, bw, bh)
        return best


def _detect_face_opencv(img: Image.Image) -> Optional[Tuple[int, int, int, int]]:
    try:
        import cv2  # type: ignore
    except Exception:
        return None

    img_gray = np.array(img.convert("L"))
    h, w = img_gray.shape
    # Use OpenCV bundled haarcascade if available
    try:
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    except Exception:
        cascade_path = None
    if not cascade_path or not os.path.exists(cascade_path):
        return None
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = face_cascade.detectMultiScale(img_gray, scaleFactor=1.1, minNeighbors=5)
    if faces is None or len(faces) == 0:
        return None
    # faces: x, y, w, h
    x, y, bw, bh = max(faces, key=lambda f: f[2] * f[3])
    return int(x), int(y), int(bw), int(bh)


def _detect_face(img: Image.Image) -> Optional[Tuple[int, int, int, int]]:
    return _detect_face_mediapipe(img) or _detect_face_opencv(img)


def _expand_crop(
    img: Image.Image, face_bbox: Tuple[int, int, int, int], cfg: CropConfig
) -> Image.Image:
    x, y, bw, bh = face_bbox
    w, h = img.size

    # Filter tiny detections
    if (bw / w) < cfg.min_face_ratio or (bh / h) < cfg.min_face_ratio:
        return img

    left = int(x - cfg.pad_left * bw)
    top = int(y - cfg.pad_top * bh)
    right = int(x + bw + cfg.pad_right * bw)
    bottom = int(y + bh + cfg.pad_bottom * bh)

    left = max(left, 0)
    top = max(top, 0)
    right = min(right, w)
    bottom = min(bottom, h)

    return img.crop((left, top, right, bottom))


def _process_image(
    src_path: Path, out_path: Path, cfg: CropConfig, remove_bg: bool
) -> None:
    img = Image.open(src_path)

    face_bbox = _detect_face(img)
    if face_bbox is None:
        # Fall back to whole image if no face detected
        cropped = img
    else:
        cropped = _expand_crop(img, face_bbox, cfg)

    if remove_bg:
        try:
            cropped = _remove_bg(cropped)
        except RuntimeError as exc:
            print(f"[warn] {src_path.name}: {exc}")

    # Always save as PNG to preserve transparency if bg removed
    _safe_mkdir(out_path.parent)
    cropped.save(out_path.with_suffix(".png"))


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Remove background and crop head portion for team images."
    )
    parser.add_argument(
        "--input",
        default="src/assets/team",
        help="Input directory of team images.",
    )
    parser.add_argument(
        "--output",
        default="src/assets/team_heads",
        help="Output directory for processed images.",
    )
    parser.add_argument(
        "--no-bg-remove",
        action="store_true",
        help="Skip background removal (only crop head region).",
    )
    parser.add_argument("--pad-top", type=float, default=0.65)
    parser.add_argument("--pad-bottom", type=float, default=0.35)
    parser.add_argument("--pad-left", type=float, default=0.35)
    parser.add_argument("--pad-right", type=float, default=0.35)
    parser.add_argument("--min-face-ratio", type=float, default=0.08)

    args = parser.parse_args()
    cfg = CropConfig(
        pad_top=args.pad_top,
        pad_bottom=args.pad_bottom,
        pad_left=args.pad_left,
        pad_right=args.pad_right,
        min_face_ratio=args.min_face_ratio,
    )

    input_dir = Path(args.input)
    output_dir = Path(args.output)

    if not input_dir.exists():
        print(f"[error] Input directory not found: {input_dir}")
        return 1

    images = list(_iter_images(input_dir))
    if not images:
        print(f"[warn] No images found in: {input_dir}")
        return 0

    for src in images:
        out_path = output_dir / src.stem
        _process_image(src, out_path, cfg, remove_bg=not args.no_bg_remove)
        print(f"[ok] {src.name} -> {out_path.with_suffix('.png').name}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
