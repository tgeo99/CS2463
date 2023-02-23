// tonejs.github.io/docs/14.7.77/Player
// Players -> multiple player obj
let sound1 = new Tone.Player("sounds/big-hit.wav");
let sounds = new Tone.Players({
  "big-hit": "sounds/big-hit.wav",
  "hey": "sounds/hey.wav",
  "yo": "sounds/yo.wav",
  "oh-yeah": "sounds/oh-yeah.wav"
});
// input -> effects -> destination
// sound    processing     speaker
let button1, button2, button3, button4;

//const effect = new Tone.FeedbackDelay("8n", 0.5);
const effect = new Tone.BitCrusher(4);
let effectSlider;

function setup() {
  createCanvas(135, 195);
  
  sounds.connect(effect);
  effect.toDestination();

  button1 = createButton('big hit!!');
  button1.position(40,50);
  button1.mousePressed(()=>buttonSound("big-hit"));
                    // lambda function
  button2 = createButton('hey');
  button2.position(50, 75);
  button2.mousePressed(()=>buttonSound("hey"));

  button3 = createButton('yo');
  button3.position(55, 100);
  button3.mousePressed(()=>buttonSound("yo"));

  button4 = createButton('oh yeah');
  button4.position(38, 125);
  button4.mousePressed(()=>buttonSound("oh-yeah"));

  
  effectSlider = createSlider(0, 1, 0, .01);
  effect.wet.value = effectSlider.value();
  effectSlider.mouseReleased( () => {
    effect.wet.value = effectSlider.value();
  })

  background(220);
  textAlign(CENTER);
  text('CRUNCH IT!', 135/2, 180);
  push();
  textStyle(BOLD);
  textSize(16);
  text('SOUNDBOARD', 135/2, 30);
  pop();

}

function draw() {
  //nothing here :) 
}

function buttonSound(whichSound) {
  switch(whichSound){
    case "big-hit":
    case "hey":
    case "yo":
    case "oh-yeah":
      sounds.player(whichSound).start();
      break;
    default:
      console.log("Invalid input to buttonSound:" + whichSound);
  }
}