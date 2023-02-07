let spriteSheet;
let walkingAnimation;
let chazSheet;
let chazAnimation;
let walking2;
let chazAnimation2;
function preload() {
  spriteSheet = loadImage("assets/SpelunkyGuy.png");
  chazSheet = loadImage("assets/Chaz.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  walkingAnimation = new WalkingAnimation(spriteSheet,80,80,200,200,9);
  walking2 = new WalkingAnimation(spriteSheet,80,80,280,280,9,1.5);
  chazAnimation = new WalkingAnimation(chazSheet,12,30,200,100,3,2,183,7);
  chazAnimation2 = new WalkingAnimation(chazSheet,12,30,100,100,3,1,183,7);
}

function draw() {
  background(220);
  
  walkingAnimation.draw();
  walking2.draw();
  chazAnimation.draw();
  chazAnimation2.draw();
}

function keyPressed() {
  walkingAnimation.keyPressed(RIGHT_ARROW,LEFT_ARROW);
  walking2.keyPressed(RIGHT_ARROW,LEFT_ARROW);
  chazAnimation.keyPressed(RIGHT_ARROW,LEFT_ARROW);
  chazAnimation2.keyPressed(RIGHT_ARROW,LEFT_ARROW);
}

function keyReleased() {
  walkingAnimation.keyReleased(RIGHT_ARROW,LEFT_ARROW);
  walking2.keyReleased(RIGHT_ARROW,LEFT_ARROW);
  chazAnimation.keyReleased(RIGHT_ARROW,LEFT_ARROW);
  chazAnimation2.keyReleased(RIGHT_ARROW,LEFT_ARROW);
}

class WalkingAnimation {
  constructor(spritesheet, sw, sh, dx, dy, animationLength, aScale = 1, offsetX = 0, offsetY = 0) {
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 0;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.aScale = aScale;
  }

  draw() {

    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : 0;
    push();
    translate(this.dx,this.dy);
    scale(this.xDirection * this.aScale, this.aScale);
  
    image(this.spritesheet,0,0,this.sw,this.sh,this.u*this.sw+this.offsetX,this.v*this.sh+this.offsetY,this.sw,this.sh);
    pop();
    if (frameCount % 6 == 0) {
      this.currentFrame++;
    }
  
    this.dx += this.moving;
  }

  keyPressed(right, left) {
    if (keyCode === right) {
      this.moving = 1;
      this.xDirection = 1;
      this.currentFrame = 1;
    } else if (keyCode === left) {
      this.moving = -1;
      this.xDirection = -1;
      this.currentFrame = 1;
    }
  }

  keyReleased(right,left) {
    if (keyCode === right || keyCode === left) {
      this.moving = 0;
    }
  }
}