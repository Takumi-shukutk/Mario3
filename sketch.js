let BallX = 200;
let BallY;
let Velo = 0;
let Grav = 0.5;
let isGrounded = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(120);
  BallX = width/2;
  BallY = height;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background('#87cefa');

    let cameraX = width / 4 - BallX;
    push();
    translate(cameraX, 0);
    if(keyIsDown(RIGHT_ARROW)){
      BallX += 5;
    }
    if(keyIsDown(LEFT_ARROW)){
      BallX -= 5;
    }

    Velo = Velo + Grav;
    BallY = BallY + Velo;
    if(BallY > height-35){
        BallY = height-35;
        Velo = 0;
        isGrounded = true;
    } else {
      isGrounded = false;
    }
    
    strokeWeight(1);
    fill("red");
    circle(BallX, BallY, 70);

    stroke(0);
    strokeWeight(10);
    // 例：長い地面を引いておく
    line(0, height - 35, 5000, height - 35); 
    // 例：途中の壁
    line(600, height - 35, 600, height - 200);

    pop();
}

function keyPressed(){
  if(keyCode == UP_ARROW && isGrounded) {
    Velo = -20;
  }
}