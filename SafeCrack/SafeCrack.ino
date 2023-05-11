#include <Arduino_JSON.h>
#include <EncoderStepCounter.h>

int ENC_A = 2;
int ENC_B = 3;
int button1 = 5;
int button2 = 6;
int button3 = 7;
int buttonEnter = 8;
int ledLose1  = 9;
int ledLose2  = 13;
int ledWrong1 = 10;
int ledWrong2 = 11;
int ledWrong3 = 12;

EncoderStepCounter encoder(ENC_A, ENC_B);
JSONVar serialOutput;

int oldPosition = 0;
int button1State     = LOW;
int button2State     = LOW;
int button3State     = LOW;
int buttonEnterState = LOW;
int ledLose1State  = 0;
int ledLose2State  = 0;
int ledWrong1State = 0;
int ledWrong2State = 0;
int ledWrong3State = 0;

void setup() {
  Serial.begin(9600);
  encoder.begin();
  pinMode(button1, INPUT_PULLUP);
  pinMode(button2, INPUT_PULLUP);
  pinMode(button3, INPUT_PULLUP);
  pinMode(buttonEnter, INPUT_PULLUP);
  pinMode(ledLose1, OUTPUT);
  pinMode(ledLose2, OUTPUT);
  pinMode(ledWrong1, OUTPUT);
  pinMode(ledWrong2, OUTPUT);
  pinMode(ledWrong3, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(ENC_A), interrupt, CHANGE);
  attachInterrupt(digitalPinToInterrupt(ENC_B), interrupt, CHANGE);
}

void interrupt(){
  encoder.tick();
}

void loop() {
  if (Serial.available()) {
    ledLose1State  = (Serial.parseInt() == 1)? HIGH : LOW;
    ledLose2State  = (Serial.parseInt() == 1)? HIGH : LOW;
    ledWrong1State = (Serial.parseInt() == 1)? HIGH : LOW;
    ledWrong2State = (Serial.parseInt() == 1)? HIGH : LOW;
    ledWrong3State = (Serial.parseInt() == 1)? HIGH : LOW;
    Serial.read();
  }
  digitalWrite(ledLose1, ledLose1State);
  digitalWrite(ledLose2, ledLose2State);
  digitalWrite(ledWrong1, ledWrong1State);
  digitalWrite(ledWrong2, ledWrong2State);
  digitalWrite(ledWrong3, ledWrong3State);

  int position = encoder.getPosition();
  if(position > oldPosition) {
    serialOutput["rotary"] = 1;
    oldPosition = position;
  }
  else if(position < oldPosition) {
    serialOutput["rotary"] = -1;
    oldPosition = position;
  }
  else{
    serialOutput["rotary"] = 0;
  }
  serialOutput["button1"]     = digitalRead(button1);
  serialOutput["button2"]     = digitalRead(button2);
  serialOutput["button3"]     = digitalRead(button3);
  serialOutput["buttonEnter"] = digitalRead(buttonEnter);
  Serial.println(serialOutput);
}