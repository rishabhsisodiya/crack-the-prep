#!/usr/bin/env python3
"""notes-src/DSA Questions.xlsx -> src/data/dsa.json

Layout: col A = Topic (repeated per row), col B = Problem, col C = done marker.
Shape: [{ "topic": str, "problems": [{ "name": str, "important": bool }] }]
Run:  python3 scripts/convert-dsa.py
"""
import json
import os
import re
import zipfile
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
XLSX = os.path.join(ROOT, "notes-src", "DSA Questions.xlsx")
OUT = os.path.join(ROOT, "src", "data", "dsa.json")
NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"


def col(ref):
    return re.match(r"[A-Z]+", ref or "A").group(0)


def main():
    z = zipfile.ZipFile(XLSX)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall(NS + "si"):
            shared.append("".join(t.text or "" for t in si.iter(NS + "t")))

    sheet = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    groups, current = [], None

    for row in sheet.iter(NS + "row"):
        cells = {}
        for c in row.findall(NS + "c"):
            t = c.get("t")
            v = c.find(NS + "v")
            if t == "s" and v is not None:
                val = shared[int(v.text)]
            elif t == "inlineStr":
                isel = c.find(NS + "is")
                val = "".join(x.text or "" for x in isel.iter(NS + "t")) if isel is not None else ""
            else:
                val = v.text if v is not None else ""
            cells[col(c.get("r", "A1"))] = (val or "").strip()

        topic = cells.get("A", "")
        problem = cells.get("B", "")
        if topic in ("Topic:", "") and problem in ("Problem:", ""):
            continue
        if not problem or problem == "Problem:":
            continue

        if current is None or topic != current["topic"]:
            current = {"topic": topic or "General", "problems": []}
            groups.append(current)

        important = bool(re.search(r"\bimp\b|\bimportant\b", problem, re.I))
        name = re.sub(r"\s*\[[^\]]*\]\s*$", "", problem).strip().rstrip(".")
        current["problems"].append({"name": name, "important": important})

    groups = [g for g in groups if g["problems"]]
    total = sum(len(g["problems"]) for g in groups)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(groups, f, indent=2, ensure_ascii=False)
    print(f"Wrote {OUT}: {len(groups)} topics, {total} problems")


if __name__ == "__main__":
    main()
