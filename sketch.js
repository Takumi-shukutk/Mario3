let BallX = 200;
let BallY;
let Velo = 0;
let Grav = 0.5;
let isGrounded;
let blockSize = 50;
let mapData = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1]
];

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

    // draw() 内、push() と translate() の後で実行
for (let r = 0; r < mapData.length; r++) {
  for (let c = 0; c < mapData[r].length; c++) {
    if (mapData[r][c] === 1) {
      fill(100); // ブロックの色（グレーなど）
      noStroke();
      rect(c * blockSize, r * blockSize, blockSize, blockSize);
    }
  }
}

    if(keyIsDown(RIGHT_ARROW)){
      BallX += 5;
    }
    if(keyIsDown(LEFT_ARROW)){
      BallX -= 5;
    }

    let col = floor(BallX / blockSize);
    let row = floor((BallY+35) / blockSize);
    if (row >= 0 && row < map.length && col >= 0 && col < map[0].length){
      if (map[row][col] == 1){
        BallY = row * blockSize - 35;
        Velo = 0;
        isGrounded = true;
      }
    } else {
      isGrounded = false;
    }
    
    strokeWeight(1);
    fill("red");
    circle(BallX, BallY, 70);
    pop();
}

function keyPressed(){
  if(keyCode == UP_ARROW && isGrounded) {
    Velo = -20;
  }
}