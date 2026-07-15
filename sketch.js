let BallX = 200;
let BallY;
let spawnX = 200;
let spawnY = 0;
let Velo = 0;
let Grav = 0.5;
let isGrounded;
let blockSize = 80;

// 敵キャラクターを管理する配列
let enemies = [];

let mapData = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(120);
  parseMapData(); // マップデータからプレイヤーと敵をスキャン
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#87cefa');

  let cameraX = width / 4 - BallX;
  push();
  translate(cameraX, 0);

  drawMap();
  
  // 敵の移動・描画・衝突判定を一括処理
  updateAndDrawEnemies();

  updatePlayerHorizontal();
  updatePlayerVertical();
  drawPlayer();

  pop();

  checkDeath();
}

function keyPressed() {
  if (keyCode == UP_ARROW && isGrounded) {
    Velo = -20;
    isGrounded = false; // 連続ジャンプ防止
  }
}


// 1. マップデータからプレイヤー（2）と敵（3）の位置を読み込む関数
function parseMapData() {
  enemies = []; // 配列をリセット
  
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
        let enemyX = c * blockSize + (blockSize / 2);
        let enemyY = r * blockSize + (blockSize / 2); // ブロックの中央
        enemies.push({
          startX: enemyX,              // 初期位置（これを目安に左右5マス判定）
          x: enemyX,                   // 現在のX座標
          y: enemyY,                   // 現在のY座標
          speed: 2,                    // 移動速度
          direction: 1,                // 1 = 右, -1 = 左
          size: 50,                    // 敵の直径
          range: blockSize * 2         // 往復する最大距離（2マス分）
        });
      }
    }
  }
}

// 2. マップ（地形ブロック）を描画する関数
function drawMap() {
  for (let r = 0; r < mapData.length; r++) {
    for (let c = 0; c < mapData[r].length; c++) {
      if (mapData[r][c] === 1) {
        fill('#b03605'); 
        noStroke();
        rect(c * blockSize, r * blockSize, blockSize, blockSize);
      }
    }
  }
}

// 2.5 敵の制御（移動・描画・接触判定・踏みつけ）を行う関数
function updateAndDrawEnemies() {
  // 配列から要素を削除する可能性があるため、逆順ループで処理します
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];

    // 左右の往復移動
    enemy.x += enemy.speed * enemy.direction;
    if (enemy.direction === 1 && enemy.x >= enemy.startX + enemy.range) {
      enemy.direction = -1;
    } else if (enemy.direction === -1 && enemy.x <= enemy.startX - enemy.range) {
      enemy.direction = 1;
    }

    // 敵の描画
    fill(148, 0, 211);
    stroke(255);
    strokeWeight(2);
    circle(enemy.x, enemy.y, enemy.size);

    // プレイヤーと敵の距離を計算
    let distanceToPlayer = dist(BallX, BallY, enemy.x, enemy.y);
    let collisionLimit = (70 / 2) + (enemy.size / 2); // 判定の閾値（60px）

    // 衝突している場合
    if (distanceToPlayer < collisionLimit) {
      
      // 【踏みつけ判定】
      // 1. プレイヤーが下降中（Velo >= 0）であること
      // 2. プレイヤーの足元（BallY）が、敵の中心（enemy.y）よりも十分高い位置にあること
      let isStepping = (Velo >= 0) && (BallY < enemy.y - 15);

      if (isStepping) {
        // 敵を倒す：配列から削除
        enemies.splice(i, 1);
        
        // プレイヤーを上方向にバウンドさせる
        Velo = -12; 
        isGrounded = false;
      } else {
        // 横や下からの衝突：プレイヤー死亡
        triggerPlayerDeath();
      }
    }
  }
}

// 3. プレイヤーの横移動と壁の衝突判定を行う関数
function updatePlayerHorizontal() {
  let speed = 5;
  if (keyIsDown(RIGHT_ARROW)) {
    let nextCol = floor((BallX + 35 + speed) / blockSize); 
    let currentRow = floor(BallY / blockSize);
    
    if (currentRow >= 0 && currentRow < mapData.length && nextCol >= 0 && nextCol < mapData[0].length) {
      if (mapData[currentRow][nextCol] !== 1) {
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
      if (mapData[currentRow][nextCol] !== 1) {
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
      if (mapData[headRow][col] === 1) {
        BallY = (headRow + 1) * blockSize + 35;
        Velo = 0;
      }
    }
  } else {
    let footRow = floor((BallY + 35) / blockSize);
    if (footRow >= 0 && footRow < mapData.length && col >= 0 && col < mapData[0].length) {
      if (mapData[footRow][col] === 1) {
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
    triggerPlayerDeath();
  }
}

// 7. 死亡時の処理を共通化
function triggerPlayerDeath() {
  BallX = spawnX;
  BallY = spawnY;
  Velo = 0;
  isGrounded = false;
}