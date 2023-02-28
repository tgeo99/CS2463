const synth1 = new Tone.Synth();
const synth2 = new Tone.MetalSynth();
const synth3 = new Tone.PluckSynth();
const synth4 = new Tone.MembraneSynth();

const distort = new Tone.Distortion(1);
distort.wet.value = 1;

const feedback = new Tone.FeedbackDelay("4n", .5).toDestination();

let currentSynth;
let octave = 4;
let syn = 'synth';
let buttons = [];
let feedbackWet = 0;
let feedbackDelay = 4;

function setup() {
  frameRate(10);
  createCanvas(620, 180);

  //sound connects
  synth1.connect(distort);
  synth2.connect(distort);
  synth3.connect(distort);
  synth4.connect(distort);
  distort.connect(feedback);

  //buttons
  buttons.push(new keyButton('A', 'C',   100, 80, 50, 50, 255, 128));
  buttons.push(new keyButton('S', 'D',   160, 80, 50, 50, 255, 128));
  buttons.push(new keyButton('D', 'E',   220, 80, 50, 50, 255, 128));
  buttons.push(new keyButton('F', 'F',   280, 80, 50, 50, 255, 128));
  buttons.push(new keyButton('J', 'G',   340, 80, 50, 50, 255, 128));
  buttons.push(new keyButton('K', 'A',   400, 80, 50, 50, 255, 128));
  buttons.push(new keyButton('L', 'B',   460, 80, 50, 50, 255, 128));
  buttons.push(new keyButton('G', '-oct',40, 110, 50, 50, 255, 128));
  buttons.push(new keyButton('H', '+oct',40,  50, 50, 50, 255, 128));
  buttons.push(new keyButton('1', 'syn1',520, 50, 50, 50, 255, 128));
  buttons.push(new keyButton('2', 'syn2',520,110, 50, 50, 255, 128));
  buttons.push(new keyButton('3', 'syn3',580, 50, 50, 50, 255, 128));
  buttons.push(new keyButton('4', 'syn4',580,110, 50, 50, 255, 128));
  rectMode(CENTER);
  textAlign(CENTER);
  currentSynth = synth1;

  wetSlider = createSlider(0, 1, 0, .01);
  wetSlider.position(100, 140);
  feedback.wet.value = wetSlider.value();
  wetSlider.mouseReleased( () => {
    feedback.wet.value = wetSlider.value();
  })

  delaySlider = createSlider(2, 8, 4, 1);
  delaySlider.position(340, 140);
  feedback.delayTime.value = delaySlider.value()+'n';
  delaySlider.mouseReleased( () => {
    feedback.delayTime.value = (delaySlider.value()+'n');
  })
}

function draw() {
  background(220);
  for(let i = 0; i < buttons.length; i++){
      push();
      if(buttons[i].state === 0){
        fill(buttons[i].defaultColor);
      }
      else{
        buttons[i].pressCounter--;
        fill(buttons[i].pressedColor);
        if(buttons[i].pressCounter === 0){
          buttons[i].state = 0;
          buttons[i].pressCounter = buttons[i].pressLength;
        }
      }
      rect(buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h);
      fill(0);
      textSize(buttons[i].w/1.5);
      text(buttons[i].name, buttons[i].x,buttons[i].y + buttons[i].h*.1);
      textSize(buttons[i].w/3);
      text(buttons[i].action, buttons[i].x,buttons[i].y + buttons[i].h*.4);
      pop();
  }

  push();
  textSize(24);
  text('Web Synthesizer', 280, 35);

  textSize(20);
  text(octave, 40, 160);
  text('Click or type above buttons to play', 280, 130);
  text(syn, 550, 160);

  textSize(16);
  text('wet', 165, 170);
  text('feedback delay', 405, 170);
  pop();
}

function play(key){
  switch(key){
    case 'a':
      currentSynth.triggerAttackRelease("C"+octave,"8n");
      buttons[0].press();
      break;
    case 's':
      currentSynth.triggerAttackRelease("D"+octave,"8n");
      buttons[1].press();
      break;
    case 'd':
      currentSynth.triggerAttackRelease("E"+octave,"8n");
      buttons[2].press();
      break;
    case 'f':
      currentSynth.triggerAttackRelease("F"+octave,"8n");
      buttons[3].press();
      break;
    case 'j':
      currentSynth.triggerAttackRelease("G"+octave,"8n");
      buttons[4].press();
      break;
    case 'k':
      currentSynth.triggerAttackRelease("A"+octave,"8n");
      buttons[5].press();
      break;
    case 'l':
      currentSynth.triggerAttackRelease("B"+octave,"8n");
      buttons[6].press();
      break;
    case 'g':
      if(octave > 1){
        octave--;
      }
      buttons[7].press();
      break;
    case 'h':
      if(octave < 8){
        octave++;
      }
      buttons[8].press();
      break;
    case '1':
      currentSynth = synth1;
      syn = 'synth';
      buttons[9].press();
      break;
    case '2':
      currentSynth = synth2;
      syn = 'metal';
      buttons[10].press();
      break;
    case '3':
      currentSynth = synth3;
      syn = 'pluck';
      buttons[11].press();
      break;
    case '4':
      currentSynth = synth4;
      syn = 'membrane';
      buttons[12].press();
      break;
    default:
      console.log("Invalid call to play: " + key);
      break;
  }
}

function keyPressed(){
  play(key);
}

function mousePressed(){
  for(let i = 0; i < buttons.length; i++){
    if(mouseX > buttons[i].x-buttons[i].w/2 && mouseX < buttons[i].x+buttons[i].w/2 && mouseY < buttons[i].y+buttons[i].h/2 && mouseY > buttons[i].y-buttons[i].h/2 ){
      //clickSwitch(buttons[i]);
      play(buttons[i].name.toLowerCase());
    }
  }
}

class keyButton {
  constructor(name, action, x, y, w, h, defaultColor, pressedColor, pressLength = 5){
    this.name = name; // key for keys
    this.action = action;
    this.x = x;
    this.y = y; 
    this.w = w; 
    this.h = h;
    this.defaultColor = defaultColor;
    this.pressedColor = pressedColor;
    this.pressLength = pressLength;
    this.state = 0;
    this.pressCounter = pressLength;

    this.press = ()=>{
      this.pressCounter = this.pressLength;
      this.state = 1;
    }

  }
}