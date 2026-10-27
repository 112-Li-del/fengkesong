"""Download public Terrarium tiles and package only the Qixia display extent."""
import io, json, math, hashlib, urllib.request
from datetime import date
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOUNDS = [118.945, 32.143, 118.984, 32.179]
SIZE, ZOOM = 97, 13
tiles = {}
def pixel(lon, lat):
    return ((lon + 180) / 360 * 2**ZOOM * 256,
            (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * 2**ZOOM * 256)
def elevation(lon, lat):
    px, py = pixel(lon, lat)
    # Terrarium values are pixel-centred.
    px, py = px - .5, py - .5
    ix, iy = math.floor(px), math.floor(py)
    def height(x, y):
        tx, ty = x // 256, y // 256
        key = (tx, ty)
        if key not in tiles:
            url = f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{ZOOM}/{tx}/{ty}.png"
            content = urllib.request.urlopen(url, timeout=40).read()
            tiles[key] = (Image.open(io.BytesIO(content)).convert("RGB"), url, hashlib.sha256(content).hexdigest())
        r, g, b = tiles[key][0].getpixel((x % 256, y % 256))
        return r * 256 + g + b / 256 - 32768
    fx, fy = px - ix, py - iy
    return ((height(ix, iy)*(1-fx)+height(ix+1, iy)*fx)*(1-fy)
            +(height(ix, iy+1)*(1-fx)+height(ix+1, iy+1)*fx)*fy)
west, south, east, north = BOUNDS
heights = [round(elevation(west+(east-west)*x/(SIZE-1), north-(north-south)*y/(SIZE-1)), 2)
           for y in range(SIZE) for x in range(SIZE)]
out = ROOT / "public/terrain"
out.mkdir(parents=True, exist_ok=True)
data = dict(version=1, bounds=BOUNDS, size=SIZE, heights=heights,
            source="Mapzen Terrain Tiles / AWS; global SRTM courtesy USGS",
            accessed=date.today().isoformat(), sourceZoom=ZOOM,
            footprint="display extent; not an official scenic boundary",
            tiles=[dict(url=t[1], sha256=t[2]) for t in tiles.values()])
(out/"qixia.json").write_text(json.dumps(data, separators=(",", ":")), encoding="utf-8")
print(json.dumps(dict(samples=len(heights), minimum=min(heights), maximum=max(heights), tiles=len(tiles))))
