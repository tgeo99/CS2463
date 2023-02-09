let img1;
let splatCount;
function preload(){
  img1 = loadImage("assets/bug.png");
}
let bugIdle, bugWalk, bugSplat;
let bugs = [];
let arrayEx = [];
let gameState;
let bugRate;
let hiscore;
let bugMiss;
let timer;
let newhiscore;
let first;
function setup(){
  frameRate(60);
  createCanvas(600,400);
  imageMode(CENTER);
  bugIdle = new Anim(img1, 1, 2, 16, 16, 0, 0);
  bugWalk = new Anim(img1, 4, 2, 16, 16, 0, 0);
  bugSplat = new Anim(img1, 1, 2, 16, 16, 0, 16);
  gameState = "TITLE";
  //console.log(gameState);
  splatCount = 0;
  hiscore = 0;
  bugRate = 100;
  bugMiss = 0;
  timer = 31;
  first = true;
}

function draw(){
  switch(gameState){
    case "GAME":
      game();
      break;
    case "TITLE":
      title();
      break;
    case "GAMEOVER":
      gameover();
      break;
  }
}

function gameover(){
  if(first === true){
    if(hiscore < splatCount){
      hiscore = splatCount;
      newhiscore = true;
    }
    else{
      newhiscore = false;
    }
    //reset
    bugs = [];
    splatCount = 0;
    bugRate = 100;
    bugMiss = 0;
    timer = 31;
    first = false;
  }
  background(237,93,93);
  push();
  textSize(36);
  textAlign(CENTER);
  text("GAME OVER", 300, 200);
  textSize(16);
  //rect(200,280,200,32);
  text("Click here to continue...", 300, 300);
  textSize(20);
  textAlign(CENTER);
  text("Hi Score: "+hiscore, 300, 24);
  pop();
  //flashing high score message
  if(newhiscore === true){
    if(frameCount % 75 < 40){
      push()
      textAlign(CENTER);
      text("!! NEW HIGH SCORE !!", 300,250);
      pop()
    }
  }
}

function title(){
  //UI TEXT
  background(240);
  push();
  textSize(36);
  textAlign(CENTER);
  text("BUG SPLAT!", 300, 200);
  textSize(16);
  text("Click to play!", 300, 250);
  textSize(20);
  textAlign(CENTER);
  text("Hi Score: "+hiscore, 300, 24);
  pop();
}


function game(){
  background(240);
  rect(0,0,600,32);
  //BUG CREATOR
  if(frameCount % Math.floor(bugRate) == 0){
    if(random(0,1) < .5){
      newBug = new WalkingController(bugSplat, bugWalk, -16,random(48, 384));
      newBug.moving = 1;
    }
    else{
      newBug = new WalkingController(bugSplat, bugWalk, 616,random(48, 384));
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
        //console.log(bugs[i].frame);
        bugs.splice(i,1);
        i--;
      }
    }
    else if(bugs[i].frame === 98){
      bugs.splice(i, 1);
      i--;
      bugMiss++
    }
  }
  //UI TEXT
  textSize(20);
  text("Bugs splat: "+splatCount, 10, 24);
  push();
  textAlign(CENTER);
  text("Hi Score: "+hiscore, 300, 24);
  textAlign(RIGHT);
  text("Missed: "+bugMiss, 590, 24)
  pop();
  timer -= deltaTime/1000;
  push();
  fill(0,0,0,64);
  textAlign(CENTER);
  textSize(128);
  text(Math.floor(timer), 300, 248);
  pop();
  if(timer<0){
    gameState = "GAMEOVER";
    //console.log(gameState);
    first = true;
  }
}

//USER INPUT
function mousePressed(){
  x = mouseX;
  y = mouseY;
  switch(gameState){
    case "GAME":
      for(i = 0; i < bugs.length; i++){
        if(bugs[i].moving != 0){
          if(x > bugs[i].x-16 && x < bugs[i].x+16){
            if(y > bugs[i].y-16 && y < bugs[i].y+16){
              //console.log("doing splat animation");
              bugs[i].moving = 0;
              bugs[i].frame = 0;
              splatCount++;
              bugRate *= .95; //5% each?
              if(bugRate < 30){
                bugRate = 30;
              }
            }
          }
        }
      }
      break;
    case "TITLE":
      gameState = "GAME";
      //console.log(gameState);
      break;
    case "GAMEOVER":
      //rect(200,280,200,32);
      if((x > 215 && x < 384) && (y > 286 && y < 302)){
        gameState = "TITLE";
        //console.log(gameState);
      }
      break;
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