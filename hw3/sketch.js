let img1;
function preload(){
  img1 = loadImage("assets/22085.png");
    //"MapleStory - Monsters (Perion) - Dark Axe Stump" by Boo.
    //Borrowed from https://www.spriters-resource.com/fullview/22085/
  img2 = loadImage("assets/Green.png");
    //Spelunky - Green
    //Borrowed from https://www.spriters-resource.com/pc_computer/spelunky/
}
let Character1;
let Character2;
let Character3;
function setup(){
  createCanvas(600,400);
  imageMode(CENTER);
  char1idle = new Anim(img1, 1, -1, 72, 80, 0, 0);
  char1walk = new Anim(img1, 4, -1, 72, 80, 0, 81);
  Character1 = new WalkingController(char1idle,char1walk, 100,100);
  
  char2idle = new Anim(img2, 1, 1, 80, 80, 0,0);
  char2walk = new Anim(img2, 9, 1, 80, 80, 0,0);
  Character2 = new WalkingController(char2idle,char2walk, 100,200);

  char3idle = new Anim(img2, 1, .5, 80, 80, 0,0);
  char3walk = new Anim(img2, 9, .5, 80, 80, 0,0);
  Character3 = new WalkingController(char3idle,char3walk, 200,200);
}

function draw(){
  background(240);
  Character1.draw();
  Character2.draw();
  Character3.draw();
}

function keyPressed() {
  Character1.keyPressed(RIGHT_ARROW, LEFT_ARROW);
  Character2.keyPressed(RIGHT_ARROW, LEFT_ARROW);
  Character3.keyPressed(RIGHT_ARROW, LEFT_ARROW);
}

function keyReleased() {
  Character1.keyReleased(RIGHT_ARROW, LEFT_ARROW);
  Character2.keyReleased(RIGHT_ARROW, LEFT_ARROW);
  Character3.keyReleased(RIGHT_ARROW, LEFT_ARROW);
}

class Anim{
  constructor(spriteSheet, numFrames, scl, spriteWidth, spriteHeight, spriteOffsetX, spriteOffsetY){
    this.spriteSheet = spriteSheet;
    this.numFrames = numFrames;
    this.scl = scl;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.spriteOffsetX = spriteOffsetX;
    this.spriteOffsetY = spriteOffsetY;
    this.draw = function(u){
      //           img       x y      dest width   dest height          x loc in img                         y loc in img          img width        img height
      image(this.spriteSheet,0,0,this.spriteWidth,this.spriteHeight,u*this.spriteWidth+this.spriteOffsetX,this.spriteOffsetY,this.spriteWidth,this.spriteHeight);
    }
  }
}

class WalkingController {
  //          anim  anim     x  y
  constructor(idle, walking, x, y){
    this.idle = idle;
    this.walking = walking;
    this.x = x;
    this.y = y;
    this.xDir = 1;
    this.frame = 0;
    this.moving = 0;

    this.draw = function(){
      if(this.moving){
        this.u = this.frame % this.walking.numFrames;
        push();
        translate(this.x,this.y);
        scale(this.walking.scl * this.xDir, Math.abs(this.walking.scl));
        this.walking.draw(this.u);
        pop();
      }
      else{
        this.u = this.frame % this.idle.numFrames;
        push();
        translate(this.x,this.y);
        scale(this.idle.scl * this.xDir, Math.abs(this.idle.scl));
        this.idle.draw(this.u);
        pop();
      }
      if (frameCount % 7 == 0) {
        this.frame++;
      }
      this.x += this.moving;
    }
    this.keyPressed = function(right,left){
      if(keyCode === right){
        this.xDir = 1;
        this.moving = 1;
      }
      if(keyCode === left){
        this.xDir = -1;
        this.moving = -1;
      }
    }
    this.keyReleased = function(right, left){
      if(keyCode === right || keyCode === left){
        this.moving = 0;
        this.frame = 0;
      }
    }
  }
}