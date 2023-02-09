let img1;
let splatCount;
function preload(){
  img1 = loadImage("assets/bug.png");
}
let bugIdle, bugWalk, bugSplat;
let bugs = [];
let arrayEx = [];
function setup(){
  frameRate(60);
  createCanvas(600,400);
  imageMode(CENTER);
  bugIdle = new Anim(img1, 1, 2, 16, 16, 0, 0);
  bugWalk = new Anim(img1, 4, 2, 16, 16, 0, 0);
  bugSplat = new Anim(img1, 1, 2, 16, 16, 0, 16);
  console.log("splice test");
  arrayEx.push("red");
  arrayEx.push("orange");
  arrayEx.push("yellow");
  console.log(arrayEx);
  arrayEx.splice(2,1);
  console.log(arrayEx);
  splatCount = 0;
}

function draw(){
  background(240);

  //BUG CREATOR
  if(frameCount % 60 == 0){
    if(random(0,1) < .5){
      newBug = new WalkingController(bugSplat, bugWalk, -16,random(16, 384));
      newBug.moving = 1;
    }
    else{
      newBug = new WalkingController(bugSplat, bugWalk, 616,random(16, 384));
      newBug.moving = -1;
      newBug.xDir = -1;
    }
    bugs.push(newBug);
  }

  //BUG RENDERER / REMOVER
  for(i = 0; i < bugs.length; i++){
    bugs[i].draw();
    if(bugs[i].moving === 0){
      if(bugs[i].frame > 10){
        console.log(bugs[i].frame);
        bugs.splice(i,1);
        i--;
      }
    }
    else if(bugs[i].frame === 100){
      bugs.splice(i, 1);
      i--;
    }
  }
  text(splatCount, 10, 10)
}

function mousePressed(){
    x = mouseX;
    y = mouseY;
    for(i = 0; i < bugs.length; i++){
      if(bugs[i].moving != 0){
        if(x > bugs[i].x-16 && x < bugs[i].x+16){
          if(y > bugs[i].y-16 && y < bugs[i].y+16){
            console.log("doing splat animation");
            bugs[i].moving = 0;
            bugs[i].frame = 0;
            splatCount++;
          }
        }
      }
    }
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
      image(this.spriteSheet,0,0,this.spriteWidth,this.spriteHeight,u*this.spriteWidth+this.spriteOffsetX,this.spriteOffsetY,this.spriteWidth,this.spriteHeight);
    }
  }
}

class WalkingController {
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
      else{ // splat
        this.u = this.frame % this.idle.numFrames;
        push();
        translate(this.x,this.y);
        scale(this.idle.scl * this.xDir, Math.abs(this.idle.scl));
        this.idle.draw(this.u);
        pop();
      };

      if (frameCount % 7 === 0) {
        this.frame++;
      }
      this.x += this.moving;
    }
  }
}