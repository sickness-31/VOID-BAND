"""
VO!D - PHOTO CREDITS BAKER
tools/credits.py

Reads the photographer name out of every JPEG in assets/press/ and
assets/shows/*/ and writes them into data/credits.js so the site can
show credits without reading the image files at runtime (which
browsers block when a page is opened from file://).

RUN IT whenever you add or change a photo, or edit an Authors field:

    python tools/credits.py

(from the folder that contains index.html). Then commit data/credits.js.

Where the name comes from (first found wins): EXIF Artist (what
Windows Explorer > Properties > Details > Authors writes), Windows
XPAuthor, XMP dc:creator, EXIF Copyright. No dependencies - standard
library only.
"""
import glob
import io
import json
import os
import re
import struct
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "credits.js")
FOLDERS = [
    os.path.join("assets", "press", "*.jpg"),
    os.path.join("assets", "press", "*.jpeg"),
    os.path.join("assets", "shows", "*", "*.jpg"),
    os.path.join("assets", "shows", "*", "*.jpeg"),
]


def read_credit(path):
    with open(path, "rb") as f:
        data = f.read(256 * 1024)
    if data[:2] != b"\xff\xd8":
        return None
    found = {}
    i = 2
    while i + 4 <= len(data):
        if data[i] != 0xFF:
            break
        marker = data[i + 1]
        if marker == 0xDA:
            break
        seglen = struct.unpack(">H", data[i + 2:i + 4])[0]
        seg = data[i + 4:i + 2 + seglen]
        if marker == 0xE1:
            if seg.startswith(b"Exif\x00\x00"):
                found.update(parse_tiff(seg[6:]))
            elif seg.startswith(b"http://ns.adobe.com/xap/1.0/\x00"):
                xmp = seg.split(b"\x00", 1)[1].decode("utf-8", "replace")
                m = re.search(r"<dc:creator>.*?<rdf:li[^>]*>(.*?)</rdf:li>", xmp, re.S)
                if m:
                    found["xmpcreator"] = m.group(1).strip()
        i += 2 + seglen
    name = (found.get("artist") or "").strip() or (found.get("xpauthor") or "").strip() \
        or (found.get("xmpcreator") or "").strip() or (found.get("copyright") or "").strip()
    # Windows joins multiple Authors with ';'
    name = ", ".join(p.strip() for p in name.split(";") if p.strip())
    return name or None


def parse_tiff(t):
    out = {}
    if t[:2] == b"II":
        e = "<"
    elif t[:2] == b"MM":
        e = ">"
    else:
        return out
    try:
        ifd0 = struct.unpack(e + "I", t[4:8])[0]
        n = struct.unpack(e + "H", t[ifd0:ifd0 + 2])[0]
    except struct.error:
        return out
    sizes = {1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1}
    for k in range(n):
        off = ifd0 + 2 + k * 12
        if off + 12 > len(t):
            break
        tag, typ, cnt = struct.unpack(e + "HHI", t[off:off + 8])
        size = sizes.get(typ, 1) * cnt
        if size <= 4:
            val = t[off + 8:off + 8 + size]
        else:
            vo = struct.unpack(e + "I", t[off + 8:off + 12])[0]
            val = t[vo:vo + size]
        if tag == 0x013B:
            out["artist"] = val.decode("utf-8", "replace").rstrip("\x00")
        elif tag == 0x9C9E:
            out["xpauthor"] = val.decode("utf-16-le", "replace").rstrip("\x00")
        elif tag == 0x8298:
            out["copyright"] = val.decode("utf-8", "replace").rstrip("\x00")
    return out


def main():
    credits = {}
    missing = []
    for pattern in FOLDERS:
        for path in sorted(glob.glob(os.path.join(ROOT, pattern))):
            rel = os.path.relpath(path, ROOT).replace(os.sep, "/")
            name = read_credit(path)
            if name:
                credits[rel] = name
            else:
                missing.append(rel)

    lines = [
        "/*",
        "  VO!D - PHOTO CREDITS (generated - do not edit by hand)",
        "  Made by tools/credits.py from each photo's Authors metadata.",
        "  To change a credit: edit the photo's Authors in Windows",
        "  (right-click > Properties > Details), then re-run:",
        "      python tools/credits.py",
        "*/",
        "window.VOID_CREDIT_DATA = " + json.dumps(credits, indent=2, ensure_ascii=False) + ";",
        "",
    ]
    with io.open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))

    print("wrote data/credits.js with %d credit(s)" % len(credits))
    for rel, name in credits.items():
        print("  %-40s %s" % (rel, name))
    if missing:
        print("no Authors set on %d file(s):" % len(missing))
        for rel in missing:
            print("  " + rel)


if __name__ == "__main__":
    main()
