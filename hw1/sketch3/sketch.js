function setup() {
  createCanvas(200, 100);
}

function draw() {
  background(0);
  push();
  noStroke();

  //pac-man

  //body
  fill(255,255,15);
  circle(52,52,80);
  //mouth
  fill(0);
  arc(52,52,81,81,(3*PI)/4,(5*PI)/4);

  //ghost

  //body
  fill(255,70,50);
  rect(110, 50, 80,40);
  arc(150,50,80,80,PI,0);
  //eye white
  fill(255);
  circle(130,50,25);
  circle(170,50,25);
  //iris
  fill(70,70,255);
  circle(130,50,15);
  circle(170,50,15);
}
