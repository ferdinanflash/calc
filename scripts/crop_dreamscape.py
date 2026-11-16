from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images" / "dreamscape"
OUTPUT = SOURCE / "cropped"
# Screenshot canvas: 1080 x 2400. Each rectangle encloses only the rounded scene map.
CROPS = {
    "Screenshot_2026-11-16-23-03-50-259_com.android.chrome.jpg": (42, 520, 1038, 2140),
    "Screenshot_2026-11-16-23-03-57-654_com.android.chrome.jpg": (42, 553, 1038, 2173),
    "Screenshot_2026-11-16-23-04-06-950_com.android.chrome.jpg": (42, 466, 1038, 2086),
    "Screenshot_2026-11-16-23-04-19-458_com.android.chrome.jpg": (42, 710, 1038, 2330),
    "Screenshot_2026-11-16-23-04-31-457_com.android.chrome.jpg": (42, 588, 1038, 2208),
}
OUTPUT.mkdir(parents=True, exist_ok=True)
for index, (filename, bounds) in enumerate(CROPS.items(), start=1):
    source = SOURCE / filename
    if not source.exists():
        raise FileNotFoundError(source)
    with Image.open(source) as image:
        if image.size != (1080, 2400):
            raise ValueError(f"{filename}: expected 1080x2400, got {image.size}")
        cropped = image.crop(bounds)
        destination = OUTPUT / f"garden-s5-stage-{index}.jpg"
        cropped.save(destination, "JPEG", quality=94, optimize=True, progressive=True)
        print(f"{destination.relative_to(ROOT)}: {cropped.size}")
