//##########################################################################################################//
//                                            CRACK THE SAFE                                                //
//Author: Tyler George                                                                                      //
//This project uses the following sounds from freesound.org:                                                //
// 1.) Metal tick 4 by kubawolanin -- https://freesound.org/s/185608/ -- License: Creative Commons 0        //
// 2.) Clock Tick by Jagadamba -- https://freesound.org/s/254316/ -- License: Attribution Noncommercial 4.0 //
//Code for connecting to Arduino serial provided by Andrew Webb                                             //
//##########################################################################################################//
//                                             DECLARATIONS                                                 //
//##########################################################################################################//

//SETTINGS
const CANVASWIDTH = 400;
const CANVASHEIGHT = 400;
const KNOBANIMATIONFRAMES = 6;  //affects length of animation
let   VALUEUPPERBOUND = 4;      //max value of padlock value
let   MAXTIME = 150;            //starting time
const BUTTONDELAY = .2;         //delay between multiple presses of same button - to reduce jitter
const ROTARYDELAY = .1;         //delay between rotary twist - to reduce jitter
//GAME VARIABLES
let state = "title";
let time, lastTime; // for clock tick, hiscores & loss
let gameWon;
let attempts;
let knobPosition; // knob value to check
let knobAnimationPosition; // handles animating knob
let soundPlayed; // plays sound on knob turn
let value1, value2, value3; // padlock values
let winValue1, winValue2, winValue3, winKnobPosition; // win condition
let winValue1f, winValue2f, winValue3f; // allows showing correct num in green;
let winTime, hiscorepos;
let winInitials = null;
//INITIAL HIGH SCORES
let winInitialsArray = [];
winInitialsArray[0] = "TLG";
winInitialsArray[1] = "FTW";
winInitialsArray[2] = "MKZ";
winInitialsArray[3] = "LOL";
winInitialsArray[4] = "ZNX";
let winTimesArray = [];
winTimesArray[0] = 30.00;
winTimesArray[1] = 60.00;
winTimesArray[2] = 90.00;
winTimesArray[3] = 120.00;
winTimesArray[4] = 149.00;
//SERIAL DATA
let port;
let writer, reader;
let sensorData = {};
const encoder = new TextEncoder();
const decorder = new TextDecoder();
let buttonEnterDelay = 0;
let button1Delay = 0;
let button2Delay = 0;
let button3Delay = 0;
let rotaryDelay = 0;
//##########################################################################################################//
//                                                 TONE.JS                                                  //
//##########################################################################################################//

let toneStarted = false;
let sirenOsc, sirenEnv, tickSynth, buzzerSynth;
let clockTickFlipper = true;
function preload() {
  sirenOsc = new Tone.Oscillator(0,'sine', 'sine');
  sirenEnv = new Tone.AmplitudeEnvelope({
    attack: 1,
    decay: 0.1,
    sustain: 1.0,
    release: 0.1
  }).toDestination();
  sirenOsc.connect(sirenEnv);
  sirenOscFreqLFO = new Tone.LFO(.15, 700, 1000);
  sirenOsc.volume.value = -30
  sirenOscFreqLFO.type = 'triangle';
  sirenOscFreqLFO.connect(sirenOsc.frequency);
  tickSynth = new Tone.Sampler({
    urls: {
      A4: "sounds/185608__kubawolanin__metal-tick-4.wav",
      C8: "sounds/254316__jagadamba__clock-tick.wav"
    }
  }).toDestination();
  buzzerSynth = new Tone.MembraneSynth({
    oscillator: {
      baseType: "sawtooth",
      volume: -5
    },
    envelope: {
      attack:  0.1,
      decay:   0.2,
      sustain: 0.3,
      release: 0.2
    }
  }).toDestination();
}
function sfx_knobSound(isCorrect){
  isCorrect? tickSynth.triggerAttackRelease(385, .2) : tickSynth.triggerAttackRelease(400, .2);
}
function sfx_numberDialSound(isCorrect){
  isCorrect? tickSynth.triggerAttackRelease(490, .2) : tickSynth.triggerAttackRelease(500, .2);
}
function sfx_clockTick(){
  let tickIntensity;
  clockTickFlipper? tickIntensity = 'E8' : tickIntensity = 'C8' ;
  tickSynth.triggerAttackRelease(tickIntensity, .2);
  clockTickFlipper = !clockTickFlipper;
}
function sfx_open(){
  tickSynth.triggerAttackRelease(200, .2);
  //tickSynth.triggerAttackRelease(275, 1);
}
function sfx_menu(){
  tickSynth.triggerAttackRelease(400, .2);
}
function sfx_buzzer(){
  buzzerSynth.triggerAttackRelease(100, .45);
}
function sfx_siren(){
  sirenOscFreqLFO.stop();
  sirenOsc.start();
  sirenEnv.triggerAttackRelease(30);
  sirenOscFreqLFO.start();
}
function sfx_stopSiren(){
  sirenOscFreqLFO.stop();
  sirenOsc.stop();
}
function startToneJS(){
  toneStarted = true;
  Tone.start();
  sirenOsc.start();
  Tone.Transport.start();
}
//##########################################################################################################//
//                                             START SKETCH                                                 //
//##########################################################################################################//
function initializePlay(){
  if(!toneStarted){
    startToneJS();
  }
  clockTickFlipper = true;
  state = "playing";
  winInitials = null;
  gameWon = false;
  soundPlayed = true;
  knobPosition = 6006;
  knobAnimationPosition = knobPosition * KNOBANIMATIONFRAMES;
  timer = MAXTIME;
  lastTime = timer - 1; // for clock tick
  attempts = 0;
  
  value1 = 0, value2 = 0, value3 = 0;
  winValue1f = false, winValue2f = false, winValue3f = false;
  randomizeValues();
}
function setup() {
  if ("serial" in navigator) {
    // The Web Serial API is supported.
    let button = createButton("connect");
    button.position(300,450);
    button.mousePressed(connect);
  }
  createCanvas(CANVASWIDTH, CANVASHEIGHT);
  frameRate(60);
}
function draw() {
  if(reader){
    handleSerialInput();
  }
  switch(state){
    case "title":
      title();
      break;
    case "playing":
      timer -= deltaTime/1000;
      play();
      break;
    case "win":
      win();
      break;
    case "gameover":
      gameover();
      break;
    case "hiscores":
      hiscores();
      break;
  }
}
//##########################################################################################################//
//                                               STATES                                                     //
//##########################################################################################################//
function title(){
  background(255);
  textAlign(CENTER,CENTER);
  textSize(50);
  text("Crack",200, 150);
  textSize(30);
  text("the", 200, 200);
  textSize(50);
  text("Safe", 200, 250);
  textSize(20);
  text("Press right button to start!",200, 325);
}
function play(){
  background(255);
  textSize(30);
  text(timer.toFixed(2),200,50);
  if(timer < 0){
    state = "gameover";
    sfx_siren();
    timer = 0;
  }
  drawSafe();
  drawKnob();
  drawNumbers();
  if(gameWon){
    state = "win";
  }
  push();
  attempts > 0 ? fill(255,0,0) : fill(100, 30, 30);
  circle(150,140,30);
  attempts > 1 ? fill(255,0,0) : fill(100, 30, 30);
  circle(200,140,30);
  attempts > 2 ? fill(255,0,0) : fill(100, 30, 30);
  circle(250,140,30);
  pop();
  if(state == "playing"){
    if     (timer.toFixed(1) > 60.0) tickRate = 2.0;
    else if(timer.toFixed(1) > 13.0) tickRate = 1.0;
    else if(timer.toFixed(1) >  5.0) tickRate = 0.5;
    else                             tickRate = 0.125;
      if(lastTime >= (timer.toFixed(2))){
        lastTime -= tickRate;
        sfx_clockTick();
      }
  }
}
function win(){
  play();
  textSize(50);
  textAlign(CENTER,CENTER);
  rectMode(CENTER);
  rect(200,200,350,80);
  text("You win!",200,200);
}
function gameover(){
  play();
  textSize(50);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  
  push();
  noStroke();
  let flasherX = 90;
  let flasherY = 100;
  let flasherXS = 150;
  let flasherYS = 75;
  if(frameCount%120 < 60){
    // if(frameCount % 60 == 0){
    //   sendLightData(true, false);
    // }
    if(frameCount % 60 == 0){
      sendLightData(true, false);
    }
    fill(255, 0, 0);  
    ellipse(flasherX, flasherY, flasherXS, flasherYS);
    fill(255, 0, 0, 50);
    ellipse(flasherX, flasherY, flasherXS*2, flasherYS*2);
    ellipse(flasherX, flasherY, flasherXS*3, flasherYS*3);
  }
  else{
    if(frameCount % 60 == 0){
      sendLightData(false, true);
    }
    fill(0, 0, 255);
    ellipse(CANVASWIDTH - flasherX, flasherY, flasherXS, flasherYS);
    fill(0, 0, 255, 50);
    ellipse(CANVASWIDTH - flasherX, flasherY, flasherXS*2, flasherYS*2);
    ellipse(CANVASWIDTH - flasherX, flasherY, flasherXS*3, flasherYS*3);
  }
  pop();
  rect(200, 200, 350, 80);
  text("GAME OVER!", 200, 200);
}
function hiscores(){
  background(255);
  textSize(50);
  text("HI SCORES",200,50);
  textSize(20);
  text("Press right button to continue", 200,325);
  push();
  var linepos = 100;
  textAlign(LEFT,CENTER);
  for(i = 0; i < 5; i++){
    text(winInitialsArray[i], 125, linepos);
    linepos += 45;
  }
  linepos = 100;
  textAlign(RIGHT,CENTER);
  for(i = 0; i < 5; i++){
    text(winTimesArray[i].toFixed(2), 275, linepos);
    linepos += 45;
  }
  pop();
}
//##########################################################################################################//
//                                                  INPUT                                                   //
//##########################################################################################################//
function handleSerialInput(){
  serialRead();
  //console.log(sensorData);
  //console.log(buttonEnterDelay + " " + button1Delay + " " + button2Delay + " " + button3Delay);
  (buttonEnterDelay > 0) ? buttonEnterDelay -= deltaTime/1000 : buttonEnterDelay = 0;
  (button1Delay > 0) ? button1Delay -= deltaTime/1000 : button1Delay = 0;
  (button2Delay > 0) ? button2Delay -= deltaTime/1000 : button2Delay = 0;
  (button3Delay > 0) ? button3Delay -= deltaTime/1000 : button3Delay = 0;
  (rotaryDelay > 0) ? rotaryDelay -= deltaTime/1000 : rotaryDelay = 0;
  if(buttonEnterDelay == 0 && sensorData.buttonEnter == 1){
    buttonEnterDelay = BUTTONDELAY * 2;
    handleButton(0);
  }
  if(button1Delay == 0 && sensorData.button1 == 1){
    button1Delay = BUTTONDELAY;
    handleButton(1);
  }
  if(button2Delay == 0 && sensorData.button2 == 1){
    button2Delay = BUTTONDELAY;
    handleButton(2);
  }
  if(button3Delay == 0 && sensorData.button3 == 1){
    button3Delay = BUTTONDELAY;
    handleButton(3);
  }
  if(state == "playing" && rotaryDelay == 0 && sensorData.rotary != 0){
    rotaryDelay += ROTARYDELAY;
    knobPosition += sensorData.rotary;
  }
}
function handleButton(buttonID){
  switch(state){
    case "title":
      if(buttonID == 0){
        initializePlay();
        sfx_menu();
      }
      break;
    case "playing":
      if(buttonID == 0){
        if(!gameWon){
          checkValues();
        }
      }
      else if(buttonID == 1){

        value1 = changeValue(value1);
        sfx_numberDialSound(value1 == winValue1);
      }
      else if(buttonID == 2){
        value2 = changeValue(value2);
        sfx_numberDialSound(value2 == winValue2);
      }
      else if(buttonID == 3){
        value3 = changeValue(value3);
        sfx_numberDialSound(value3 == winValue3);
      }
      break;
    case "win":
      if(buttonID == 0){
        sfx_menu();
        winTime = MAXTIME - timer;
        console.log(winTime);
        for(i = 0; i < 5; i++){
          if(winTime < winTimesArray[i]){
            hiscorepos=i;
            while(winInitials === null){
              winInitials = prompt("High score! Enter your initials!");
            }
            winInitials.length > 3 ? winInitials = winInitials.substring(0,3).toUpperCase() : winInitials = winInitials.substring(0,winInitials.length).toUpperCase();
            winInitialsArray.splice(i, 0, winInitials);
            winTimesArray.splice(i, 0, winTime);
            break;
          }
          else(hiscorepos = 999);
        }
        state = "hiscores";
        attempts = 0;
        sendLightData(false, false);
      }
      break;
    case "gameover":
      if(buttonID == 0){
        sfx_menu();
        state = "hiscores";
        attempts = 0;
        sendLightData(false, false);
      }
      break;
    case "hiscores":
      sendLightData(false, false);
      if(buttonID == 0){
        sfx_menu();
        sfx_stopSiren();
        state = "title";
      }
      break;
  }
}
//##########################################################################################################//
//                                               DRAW FUNCTIONS                                             //
//##########################################################################################################//
function drawSafe(){
  push();
  rectMode(CENTER);
  fill(70);
  rect(200,200,380,200);
  noFill();
  rect(200,200,360,180);
  fill(50);
  rect(350,200, 40, 60);
  fill(0);
  rect(360,200, 10, 50);
  pop();
}
function drawKnob(){
  push();
  rectMode(CENTER);
  //handle knob animation
  if(knobAnimationPosition/KNOBANIMATIONFRAMES < knobPosition){
    knobAnimationPosition++;
    soundPlayed = false;
  }
  else if(knobAnimationPosition/KNOBANIMATIONFRAMES > knobPosition){
    knobAnimationPosition--;
    soundPlayed = false;
  }
  if(!soundPlayed && knobAnimationPosition%KNOBANIMATIONFRAMES == 0){ //done turning
    soundPlayed = true;
    sfx_knobSound(knobPosition%12 == winKnobPosition);
  }
  translate(CANVASWIDTH/4,CANVASHEIGHT/2);
  rotate(knobAnimationPosition/KNOBANIMATIONFRAMES * (2 * PI / 12));
  fill(200,200,200);
  circle(0,0,100);
  fill(0);
  rect(0,25,5,50);
  pop();
}
function drawNumbers(){
  push();
  fill(255);
  // if(winValue1f){
  //   fill(30,255,30);
  // }
  // else fill(255);
  drawNumberBox(value1, 0, 0);
  // if(winValue2f){
  //   fill(30,255,30);
  // }
  // else fill(255);
  drawNumberBox(value2, 50, 0);
  // if(winValue3f){
  //   fill(30,255,30);
  // }
  // else fill(255);
  drawNumberBox(value3, 100, 0);
  pop();
}
function drawNumberBox(number, x, y){
  push();
  rectMode(CENTER);
  textAlign(CENTER,CENTER);
  textSize(32);
  translate(CANVASWIDTH/2 -10,CANVASHEIGHT/2);
  rect(x,y,40,40);
  fill(0);
  text(number,x,y);
  pop();
}
//##########################################################################################################//
//                                                  LOGIC                                                   //
//##########################################################################################################//
function changeValue(value){
  if(value == VALUEUPPERBOUND){
    value = 0;
  }
  else{
    value++;
  }
  return value;
}
function randomizeValues(){
  winValue1 = randomInteger(0, VALUEUPPERBOUND);
  console.log(winValue1);
  winValue2 = randomInteger(0, VALUEUPPERBOUND);
  console.log(winValue2);
  winValue3 = randomInteger(0, VALUEUPPERBOUND);
  console.log(winValue3);
  winKnobPosition = randomInteger(0, 12);
  console.log(winKnobPosition);
}
function checkValues(){
  if(value1 === winValue1){
    winValue1f = true;
  }
  else winValue1f = false;
  if(value2 === winValue2){
    winValue2f = true;
  }
  else winValue2f = false;
  if(value3 === winValue3){
    winValue3f = true;
  }
  else winValue3f = false;
  if((knobPosition%12 === winKnobPosition) && winValue1f && winValue2f && winValue3f){
    gameWon = true;
    sfx_open();
  }
  else{
    attempts++;
    sfx_buzzer();
    if(attempts >= 3){
      sfx_siren();
      state = "gameover";
    }
  }
  sendLightData(false, false);
}
function randomInteger(min, max) {
  max + 1;
  return Math.floor(Math.random() * (max - min) ) + min;
}

//##########################################################################################################//
//                                   SERIAL FUNCTIONALITY : ANDREW WEBB                                     //
//##########################################################################################################//

function serialWrite(jsonObject) {
  if (writer) {
    writer.write(encoder.encode(JSON.stringify(jsonObject)+"\n"));
    console.log(JSON.stringify(jsonObject)+"\n");
  }
}

async function serialRead() {
  while(true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    //console.log(value);
    sensorData = JSON.parse(value);
  }
}

async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();

  Tone.Transport.start();
}

class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}

//##########################################################################################################//
//                                           SERIAL WRITE                                                   //
//##########################################################################################################//

function sendLightData(lFlash, rFlash){
  serialWrite(lFlash ? 1: 0);
  serialWrite(rFlash ? 1 : 0);
  serialWrite(attempts > 0 ? 1 : 0);
  serialWrite(attempts > 1 ? 1 : 0);
  serialWrite(attempts > 2 ? 1 : 0);
  //serialWrite('#');
}