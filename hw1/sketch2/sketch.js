function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(255);
  push();
  noStroke();
  
  push();
    fill(255,0,0,90);
    circle(150,75,100);
  pop();
  push();
    fill(0,255,0,90);
    circle(180,130,100);
  pop();
  push();
   fill(0,0,255,90);
    circle(120,130,100);
  pop();
  pop();
}
