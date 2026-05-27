let BallX;
let BallY;
let Velo = 0;
let Grav = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(120);
  BallX = width/2;
  BallY = 100;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    Velo = Velo + Grav;
    BallY = BallY + Velo;
    background(220);
    strokeWeight(1);
    fill("red");
    circle(BallX, BallY, 70);
    strokeWeight(10);
    line(windowWidth/4, 0, windowWidth/4, windowHeight);
    line(windowWidth*3/4, 0, windowWidth*3/4, windowHeight);
    if(BallY > height-35){
        BallY = height-35
        Velo = Velo*-1
    }
}