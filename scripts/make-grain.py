"""Writes a 128x128 tiling monochrome noise PNG used as leather/paper grain.

16 grey levels in a 4-bit palette with a constant ~43% alpha (tRNS chunk):
same look as 8-bit noise at a quarter of the bytes.
"""
import random
from PIL import Image

random.seed(17)
size = 128
levels = 16
alpha = 110

img = Image.new("P", (size, size))
palette = []
for i in range(levels):
    v = round(i * 255 / (levels - 1))
    palette += [v, v, v]
img.putpalette(palette)
img.info["transparency"] = bytes([alpha] * levels)
px = img.load()
for y in range(size):
    for x in range(size):
        px[x, y] = random.randint(0, levels - 1)
img.save("public/textures/grain-128.png", optimize=True, bits=4)
print("wrote public/textures/grain-128.png")
