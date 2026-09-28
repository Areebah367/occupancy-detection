# Occupancy Detection

The dataset has been taken from Kaggle and is about the occupancy of an office
room — detecting whether a room is occupied from sensor readings (temperature,
humidity, light, and CO2).

More on the data here:
[Occupancy Detection Data Set (UCI) — Kaggle](https://www.kaggle.com/datasets/robmarkcole/occupancy-detection-data-set-uci/data)

## Visualisation

A p5.js sketch that simulates one day (3 Feb 2015) in the office: the room
floor colour follows CO2, the window brightness follows the light reading,
people appear when the room is occupied, and a CO2 graph runs along the
bottom. Hover to scrub through the day.

- [View the sketch](https://editor.p5js.org/areebah/full/AfZElgzNU)
- [Open in the p5.js editor](https://editor.p5js.org/areebah/sketches/AfZElgzNU)

## Files

- `sketch.js` — the p5.js sketch
- `index.html` — runs the sketch in a browser (p5.js loaded from CDN)
- `datatest.txt` — the file the sketch visualises
- `datatest2.txt`, `datatraining.txt` — the other two splits from the dataset

## Run locally

`loadStrings` fetches the data file, so it needs a local server rather than
opening `index.html` directly:

```bash
cd occupancy-detection
python3 -m http.server 8000
# then open http://localhost:8000
```
