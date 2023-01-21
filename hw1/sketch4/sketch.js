function setup() {
  createCanvas(200, 200);
}

function draw() {
  background(0,0,128);
  push();
  stroke(255,255,255);
  strokeWeight(3);
  fill(10,130,50);
  circle(100,100,100);

  fill(255,0,0);
  beginShape();
  vertex(100,47);
  vertex(110,85);//in
  vertex(150,85);
  vertex(120,105);//in
  vertex(130,145);
  vertex(100,120);//in
  vertex(70,145);
  vertex(80,105);//in
  vertex(50,85);
  vertex(90,85);//in
  vertex(100,47);
  endShape();
  pop();
}
