let osc = new Tone.AMOscillator(800,'sine','sine').start()
let gain = new Tone.Gain().toDestination();
let pan = new Tone.Panner().connect(gain);
let ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 1.0,
  release: 0.8
}).connect(pan);
osc.connect(ampEnv);

// Effects for us to insert into the signal chain and modulate
let delay = new Tone.FeedbackDelay("8n", 0.5);


let panLFO = new Tone.LFO(1, -.7, .7).start();
panLFO.type = 'sine';
panLFO.connect(pan.pan);

let freqLFO = new Tone.LFO(0.1, 100, 600);
freqLFO.type = 'triangle';
freqLFO.connect(osc.frequency);

//footsteps
let noise = new Tone.Noise('pink').start();
let noiseEnv = new Tone.AmplitudeEnvelope({
  attack: 0.01,
  decay: 0.1,
  sustain: 0.01,
  release: 0.1
});
let noiseFilter = new Tone.Filter({
  type: "highpass",
  frequency: 100
});
let noiseFilter2 = new Tone.Filter({
  type: "lowpass",
  frequency: 250
});
const stepGain = new Tone.Gain(.5).toDestination();
let crunch = new Tone.BitCrusher(4).connect(stepGain);
noise.connect(noiseEnv);
noiseEnv.connect(noiseFilter);
noiseFilter.connect(noiseFilter2)
noiseFilter2.connect(crunch);

let stickimg;
let clickedTime;
let once = true;

function preload(){
  stickimg = loadImage("assets/Stick.png");
}

function setup() {
  createCanvas(400, 400);
  stickIdle = new Anim(stickimg, 2, 2, 15, 31, 0, 0);
  stickWalk = new Anim(stickimg, 2, 2, 15, 31, 0, 32);
  stickFall = new Anim(stickimg, 2, 2, 15, 31, 0, 64);
  stickman = new WalkingController(stickIdle, stickWalk, 50,189);
  freqLFO.stop()
}

function draw() {
  background(80, 100, 255);
  noStroke();
  fill(40,150,20);
  rect(0,250,400 ,150);
  fill(50,30,0);
  if(frameCount > 340 + clickedTime){
    //stop sound
  }
  else if(frameCount > 160+ clickedTime) {
    ampEnv.triggerAttackRelease("8n");
    stickman.moveAxis = 'y';
    stickman.moving = 1;
    stickman.walking = stickFall;

    
  }
  if(frameCount > 140 + clickedTime) rect(160,250, 70,150);
  else if(frameCount > 130 + clickedTime){
    stickman.moving = 0;
  }
  stickman.draw();
}

function mouseClicked(){
  if(once){
    Tone.start();
    freqLFO.start();
    once = false;
    clickedTime = frameCount;
    stickman.moving = 1;
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
    this.moveAxis = 'x';
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
        if(this.moveAxis === 'x' && this.moving === 1){
          noiseEnv.triggerAttackRelease("4n");
          //footstep
        }
      }
      if(this.moveAxis === 'x') this.x += this.moving;
      else if(this.moveAxis === 'y')this.y += this.moving;
    }
  }
}