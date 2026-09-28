let strings = []
let rows = []

async function setup() {
  createCanvas(800, 500);
  strings = await loadStrings("datatest.txt");
  if (strings == null) {
  print("failed to load the file, stopping here");
    // stops draw() from running
  noLoop();
    // leaves setup()
  return;
}

  // this gives me the number of rows i have in the data
  print("loaded " + strings.length + " lines");
  // this gives me the name of columns
  print(strings[0])
  // I want to see if the number of columns corelates to the number of column headers
  print(strings[1])
  // ATTEMPT 1: parse every line after the header
  //this crashed with "TypeError: Cannot read properties of undefined
  //(reading 'startsWith')", meaning cols[1] didn't exist on some line
  //
  // for (let i = 1; i < strings.length; i++) {
  //   let cols = strings[i].replaceAll('"', '').split(',');
  //   let date = cols[1];
  //   if (date.startsWith('2015-02-03')) { ... }
  // }

  // check the last line of the file
  let last = strings[strings.length - 1];
  print("last line: '" + last + "' (length " + last.length + ")");
  // result: the last line is empty, so split(',') gives only one
  // column and cols[1] is undefined

  // ATTEMPT 2: skip any line that doesn't have all 8 columns.
  // This handles the blank line at the end, and would also catch
  // any broken or incomplete rows.
  for (let i = 1; i < strings.length; i++) {
    //getting rid of the quotes so that the we can easily put each element into an array, and like all elements are in one format
    let cols = strings[i].replaceAll('"', '').split(',');
    if (cols.length < 8) continue;

    let date = cols[1];
    if (date.startsWith('2015-02-03')) {
      rows.push({
        // the date starts at the 11th index and we truncate right before seconds
        time: date.slice(11, 16),
        temp: float(cols[2]),
        light: float(cols[4]),
        co2: float(cols[5]),
        occ: int(cols[7])
      });
    }
  }
  // I want to simulate for 3rd feb only
  print("rows for Feb 3: " + rows.length);
}
let idx = 0;

function draw() {
  background(245);
  if (rows.length === 0) return;

  // pick the minute: hover to scrub, otherwise play through the day
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    idx = floor(map(mouseX, 0, width, 0, rows.length - 1));
  } else {
    idx = (idx + 2) % rows.length;
  }
  let r = rows[idx];

  // ROOM: floor color follows CO2 (blue = fresh, red = stuffy)
  let t = constrain(map(r.co2, 400, 1400, 0, 1), 0, 1);
  fill(lerpColor(color(120, 180, 230), color(230, 90, 80), t));
  stroke(60);
  strokeWeight(4);
  rect(100, 40, 600, 260);

  // window on the top wall gets brighter with the light reading
  //i am mapping the light data to within the 40 to 255 range
  //using constraint incase any value is out of range
  let b = constrain(map(r.light, 0, 700, 40, 255), 40, 255);
  noStroke();
  fill(b, b, 180);
  rect(300, 34, 200, 12);

  // desks
  fill(210);
  stroke(60);
  strokeWeight(1);
  rect(180, 120, 120, 60);
  rect(500, 120, 120, 60);

  // people appear when the room is occupied
  if (r.occ === 1) {
    noStroke();
    fill(40);
    circle(240, 205, 26);
    circle(560, 205, 26);
  }

  // readout
  noStroke();
  fill(20);
  textSize(22);
  text(r.time, 115, 75);
  textSize(14);
  text("CO2: " + round(r.co2) + " ppm   Temp: " + nf(r.temp, 0, 1) + " C", 115, 285);

  // GRAPH: CO2 across the whole day
  // positioning the garph
  let gTop = 330, gBot = 470;
  noFill();
  stroke(80);
  strokeWeight(1.5);
  // giving all the data points for the graph
  beginShape();
  for (let i = 0; i < rows.length; i++) {
    // excluding the last line
    let x = map(i, 0, rows.length - 1, 0, width);

    let y = map(rows[i].co2, 400, 1450, gBot, gTop);
    vertex(x, y);
  }
  // connects all data points with a line
  endShape();

  // 800 ppm line, a common trigger point for ventilation
  let yLimit = map(800, 400, 1450, gBot, gTop);
  stroke(230, 90, 80);
  drawingContext.setLineDash([5, 5]);
  line(0, yLimit, width, yLimit);
  drawingContext.setLineDash([]);
  noStroke();
  fill(230, 90, 80);
  textSize(11);
  text("800 ppm", 5, yLimit - 4);

  // marker for the current minute
  let xNow = map(idx, 0, rows.length - 1, 0, width);
  stroke(0);
  line(xNow, gTop, xNow, gBot);
}
