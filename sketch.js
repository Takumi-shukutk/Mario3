let BallX = 200;
let BallY;
let spawnX = 200;
let spawnY = 0;
let Velo = 0;
let Grav = 0.5;
let isGrounded;
const blockSize = 80;
let isGameClear = false;
let isGameOver = false;
let clearStartTime = 0;
let groundImg;
let life = 3;

let enemies = [];
let goalBlocks = [];

let mapData = [];
let stage = 0;

function preload() {
  groundImg = loadImage('Images/ground.png');
  blockImg = loadImage('Images/block.png');
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(120);
  parseMapData();
  life = 3;
  stage = 1;
  loadStage(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#87cefa');

  if (isGameClear) {
    let elapsedTime = millis() - clearStartTime;
    if (stage >= MAX_STAGE) {
      drawClearScreen();
      return;
    } else {
      if (elapsedTime < 2000) {
        drawChangeStage();
      } else {
        loadStage(stage + 1);
      }
      return;
    }
  }

  if (isGameOver) {
    if (life > 0) {
      drawDeathScreen();
    } else {
      drawEnd();
    }
    return;
  }

  drawLife();

  let cameraX = width / 4 - BallX;
  push();
  translate(cameraX, 0);

  drawMap();

  updateAndDrawEnemies();

  updatePlayerHorizontal();
  updatePlayerVertical();
  drawPlayer();

  checkGoal();

  pop();

  checkDeath();
// Debug
    fill(255, 255, 255);
    noStroke();
    textAlign(RIGHT, TOP);
    textSize(40);
    text(stage, 200, 20)
}

function keyPressed() {
  if (keyCode == UP_ARROW && isGrounded) {
    Velo = -20;
    isGrounded = false;
  }
  if (key === 'r' || key === 'R') {
    if (isGameOver && life > 0) {
      restartGame();
    } else if (isGameClear && stage >= MAX_STAGE) {
      restartGame();
    }
  }
}

function loadStage(stageNum, regenerate = true) {
  stage = stageNum;
  if (stage > MAX_STAGE) { isGameClear = true; return; }
  if (regenerate || mapData.length === 0) mapData = generateStage(stage);
  isGameClear = false;
  isGameOver = false;
  Velo = 0;
  parseMapData();
}

function restartGame() {
  clearStartTime = 0;
  if (isGameClear) {
    if (life < 3) {
      life = 3;
    }
    loadStage(1);
  } else {
    loadStage(stage, false);
  }
}

function drawChangeStage() {
  background(0, 0, 0, 200);
  push();
  translate(width / 2, height / 2);
  fill(255, 255, 255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(80);
  text("STAGE " + (stage + 1), 0, 0);
  pop();
}

function drawClearScreen() {
  background(0, 0, 0, 200);
  push();
  translate(width / 2, height / 2);

  fill(255, 215, 0);
  stroke(255, 255, 0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);
  textSize(80);
  if (life >= 3 + MAX_STAGE) {
    text("PERFECT!!", 0, -50);
  } else {
    text("GAME CLEAR!", 0, -50);
  }

  fill(255);
  noStroke();
  textSize(30);
  text("Rキーでリスタート", 0, 50);

  pop();
}

function drawLife() {
  fill(255, 0, 0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(40);
  let lifeText = "";
  if (life <= 10) {
    lifeText = "♥ ".repeat(life);
  } else {
    lifeText = "♥ : " + life;
  }
  text(lifeText, 20, 20);
}

function drawDeathScreen() {
  background(0, 0, 0, 200);
  push();
  translate(width / 2, height / 2);

  fill(255, 0, 0);
  stroke(255, 255, 0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);
  textSize(80);
  text("GAME OVER", 0, -50);

  fill(255);
  noStroke();
  textSize(30);
  text("Rキーでリスタート", 0, 50);

  pop();
}

function drawEnd() {
  background(0, 0, 0, 200);
  push();
  translate(width / 2, height / 2);

  fill(255, 0, 0);
  stroke(255, 255, 0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);
  textSize(80);
  text("GAME OVER", 0, -50);

  fill(255);
  noStroke();
  textSize(30);
  text("Ctrl + Rキーでリスタート", 0, 50);

  pop();
}

function isSolidTile(row, col) {
  if (row < 0 || row >= mapData.length || col < 0 || col >= mapData[0].length) return false;
  let t = mapData[row][col];
  return t === 1 || t === 4 || t === 5 || t === 6;
}

// 1. マップデータからプレイヤー（2）と敵（3）、ゴール（4）の位置を読み込む関数
function parseMapData() {
  enemies = []; // 配列をリセット
  goalBlocks = []; // ゴールブロック配列をリセット

  for (let r = 0; r < mapData.length; r++) {
    for (let c = 0; c < mapData[r].length; c++) {
      // プレイヤーの初期スポーン地点
      if (mapData[r][c] === 2) {
        spawnX = c * blockSize + (blockSize / 2);
        spawnY = r * blockSize;
        BallX = spawnX;
        BallY = spawnY;
      }
      // 敵の配置
      else if (mapData[r][c] === 3) {
        let enemySize = 50;
        enemies.push({
          startX: c * blockSize + (blockSize / 2),
          x: c * blockSize + (blockSize / 2),
          y: r * blockSize + (blockSize / 2),   // 初期位置。あとは重力で着地
          vy: 0,                                 // ← 縦速度を追加
          speed: 2,
          direction: 1,
          size: enemySize,
          range: blockSize * 2
        });
      }
      // ゴールブロックの配置
      else if (mapData[r][c] === 4) {
        goalBlocks.push({
          x: c * blockSize,
          y: r * blockSize,
          w: blockSize,
          h: blockSize
        });
      }
    }
  }
}

// 2. マップ（地形ブロックとゴールブロック）を描画する関数
function drawMap() {
  for (let r = 0; r < mapData.length; r++) {
    for (let c = 0; c < mapData[r].length; c++) {
      if (mapData[r][c] === 1) {
        image(groundImg, c * blockSize, r * blockSize, blockSize, blockSize);
      }
      else if (mapData[r][c] === 4) {
        // ゴールブロック：金色に光る演出
        let glow = sin(frameCount * 0.1) * 30 + 225;
        fill(glow, 215, 0);
        stroke(255, 255, 100);
        strokeWeight(2);
        rect(c * blockSize, r * blockSize, blockSize, blockSize);
      }
      else if (mapData[r][c] === 6) {
        image(blockImg, c * blockSize, r * blockSize, blockSize, blockSize);
      }
    }
  }
}

// ゴール判定を行う関数
function checkGoal() {
  let r = 35;
  for (let g of goalBlocks) {
    let cx = constrain(BallX, g.x, g.x + g.w);
    let cy = constrain(BallY, g.y, g.y + g.h);
    let dx = BallX - cx;
    let dy = BallY - cy;
    if (dx * dx + dy * dy <= r * r) {
      if (!isGameClear) {
        isGameClear = true;
        clearStartTime = millis();
        life += 1
      }
    }
  }
}

function updateAndDrawEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    let radius = enemy.size / 2;

    // --- 横移動（壁・範囲で反転） ---
    let nextX = enemy.x + enemy.speed * enemy.direction;
    let frontEdge = nextX + enemy.direction * radius;       // 進行方向の先端
    let col = floor(frontEdge / blockSize);
    let row = floor(enemy.y / blockSize);

    let hitWall = isSolidTile(row, col);                    // 壁にぶつかる
    let atRange = (enemy.direction === 1 && nextX >= enemy.startX + enemy.range) ||
      (enemy.direction === -1 && nextX <= enemy.startX - enemy.range);

    if (hitWall || atRange) {
      enemy.direction *= -1;   // ぶつかる／端まで来たら反転（めり込み防止）
    } else {
      enemy.x = nextX;
    }

    // --- 縦移動（重力＋着地） ---
    enemy.vy += Grav;
    enemy.y += enemy.vy;
    let vcol = floor(enemy.x / blockSize);

    if (enemy.vy >= 0) {
      // 落下中：足元が固体なら上に乗せる
      let footRow = floor((enemy.y + radius) / blockSize);
      if (isSolidTile(footRow, vcol)) {
        enemy.y = footRow * blockSize - radius;
        enemy.vy = 0;
      }
    } else {
      // 上昇中（スポーン位置補正など）：頭が固体なら止める
      let headRow = floor((enemy.y - radius) / blockSize);
      if (isSolidTile(headRow, vcol)) {
        enemy.y = (headRow + 1) * blockSize + radius;
        enemy.vy = 0;
      }
    }

    // --- 描画（既存のまま） ---
    fill(148, 0, 211);
    stroke(255);
    strokeWeight(2);
    circle(enemy.x, enemy.y, enemy.size);

    // --- プレイヤーとの当たり／踏みつけ判定（既存のまま） ---
    let distanceToPlayer = dist(BallX, BallY, enemy.x, enemy.y);
    let collisionLimit = (70 / 2) + (enemy.size / 2);

    if (distanceToPlayer < collisionLimit) {
      let isStepping = (Velo >= 0) && (BallY < enemy.y - 15);
      if (isStepping) {
        enemies.splice(i, 1);
        Velo = -12;
        isGrounded = false;
      } else {
        life -= 1;
        isGameOver = true;
      }
    }
  }
}
// 敵の描画
fill(148, 0, 211);
stroke(255);
strokeWeight(2);
circle(enemy.x, enemy.y, enemy.size);

// プレイヤーと敵の距離を計算
let distanceToPlayer = dist(BallX, BallY, enemy.x, enemy.y);
let collisionLimit = (70 / 2) + (enemy.size / 2); // 判定の閾値（60px）

// 3. プレイヤーの横移動と壁の衝突判定を行う関数
function updatePlayerHorizontal() {
  let speed = 5;
  if (keyIsDown(RIGHT_ARROW)) {
    let nextCol = floor((BallX + 35 + speed) / blockSize);
    let currentRow = floor(BallY / blockSize);

    if (currentRow >= 0 && currentRow < mapData.length && nextCol >= 0 && nextCol < mapData[0].length) {
      if (mapData[currentRow][nextCol] !== 1 && mapData[currentRow][nextCol] !== 4 && mapData[currentRow][nextCol] !== 5 && mapData[currentRow][nextCol] !== 6) {
        BallX += speed;
      }
    } else {
      BallX += speed;
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    let nextCol = floor((BallX - 35 - speed) / blockSize);
    let currentRow = floor(BallY / blockSize);

    if (currentRow >= 0 && currentRow < mapData.length && nextCol >= 0 && nextCol < mapData[0].length) {
      if (mapData[currentRow][nextCol] !== 1 && mapData[currentRow][nextCol] !== 4 && mapData[currentRow][nextCol] !== 5 && mapData[currentRow][nextCol] !== 6) {
        BallX -= speed;
      }
    } else {
      BallX -= speed;
    }
  }
}

// 4. プレイヤーの縦移動（重力）と着地・頭突き判定を行う関数
function updatePlayerVertical() {
  Velo = Velo + Grav;
  BallY = BallY + Velo;

  let col = floor(BallX / blockSize);

  if (Velo < 0) {
    let headRow = floor((BallY - 35) / blockSize);
    if (headRow >= 0 && headRow < mapData.length && col >= 0 && col < mapData[0].length) {
      if (mapData[headRow][col] === 1 || mapData[headRow][col] === 4 || mapData[headRow][col] === 5 || mapData[headRow][col] === 6) {
        BallY = (headRow + 1) * blockSize + 35;
        Velo = 0;
      }
    }
  } else {
    let footRow = floor((BallY + 35) / blockSize);
    if (footRow >= 0 && footRow < mapData.length && col >= 0 && col < mapData[0].length) {
      if (mapData[footRow][col] === 1 || mapData[footRow][col] === 4 || mapData[footRow][col] === 5 || mapData[footRow][col] === 6) {
        BallY = footRow * blockSize - 35;
        Velo = 0;
        isGrounded = true;
      } else {
        isGrounded = false;
      }
    } else {
      isGrounded = false;
    }
  }

  if (BallY < -100) {
    isGrounded = false;
  }
}

// 5. プレイヤー（赤丸）を描画する関数
function drawPlayer() {
  strokeWeight(1);
  stroke(0);
  fill("red");
  circle(BallX, BallY, 70);
}

// 6. 落下による死亡チェックと自動リスポーンを行う関数
function checkDeath() {
  let mapBottom = mapData.length * blockSize;
  if (BallY > mapBottom + 100 || BallY > height + 100) {
    life -= 1;
    isGameOver = true;
  }
}