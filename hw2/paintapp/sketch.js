function setup() {
  createCanvas(600, 600);
  background(255);
  //button
  push();
  noStroke();
  fill("red");
  square(0,0,20);
  fill("orange");
  square(0,20,20);
  fill("yellow");
  square(0,40,20);
  fill("green");
  square(0,60,20);
  fill("cyan");
  square(0,80,20);
  fill("blue");
  square(0,100,20);
  fill("magenta");
  square(0,120,20);
  fill("brown");
  square(0,140,20);
  fill("white");
  square(0,160,20);
  fill("black");
  square(0,180,20);
  pop();
  strokeWeight(5);
}

const button_area = 200;
var prev_x = 20;
var prev_y = 220;

function draw() {
  if(mouseIsPressed && !(mouseX < 20 && mouseY < button_area)&& !(prev_x < 20 && prev_y < button_area)){
    line(prev_x, prev_y, mouseX, mouseY);
  }
  prev_x = mouseX;
  prev_y = mouseY;
}

function mousePressed(){
  if(mouseX < 20 && mouseY < button_area){
    //pick color
    if(mouseY < 20){
      stroke("red");
    }
    else if(mouseY < 40){
      stroke("orange");
    }
    else if(mouseY < 60){
      stroke("yellow");
    }
    else if(mouseY < 80){
      stroke("green");
    }
    else if(mouseY < 100){
      stroke("cyan");
    }
    else if(mouseY < 120){
      stroke("blue");
    }
    else if(mouseY < 140){
      stroke("magenta");
    }
    else if(mouseY < 160){
      stroke("brown");
    }
    else if(mouseY < 180){
      stroke("white");
    }
    else if(mouseY < 200){
      stroke("black");
    }
  }
}
