// 【チャンク作成ルール】
//  - 幅 CHUNK_W 列。縦は下から6行分だけ書けばOK（上は自動で空気を補完）
//  - 両端の列（左端・右端）は「地面あり・上は空」にする → どのチャンク同士を繋いでも詰まない/落ちない
//  - 穴は最大3マスまで（ジャンプで越えられる幅）
//  - 各行は必ず CHUNK_W 文字（起動時に長さチェックして警告します）
//
// ===== チャンク式ステージ自動生成 =====
// 0...air 1...ground 2...start 3...enemy 4...goal 5...invisible 6...block

const CHUNK_W = 12;
const STAGE_H = 12;      // マップ全体の行数
const CHUNK_H = 6;       // チャンクとして書く行数（下側）
const MAX_STAGE = NaN;

// ---- スタートチャンク（必ず 2 を含む）----
const startChunks = [
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "002000000300",
    "111111111111",
  ],
  [
    "000000000000",
    "000000000000",
    "000011100000",
    "000000000000",
    "002000000030",
    "111111001111",
  ],
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "002000000000",
    "111111110011",
  ],
];

// ---- 中間チャンク ----
const midChunks = [
  // 平地＋敵
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "000003000000",
    "111111111111",
  ],
  // 穴3マス＋敵
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "000000003000",
    "111100011111",
  ],
  // 階段状の足場
  [
    "000000000000",
    "000000000666",
    "000006660000",
    "006600000000",
    "000000000000",
    "111000000000",
  ],
  // 壁（高さ2）を挟んで敵
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000600000",
    "003000600300",
    "111111111111",
  ],
  // 穴の上に浮き足場
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000066066000",
    "000000000000",
    "111000000111",
  ],
  // 敵2体
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "000300030000",
    "111111111111",
  ],
  // 2段ジャンプ
  [
    "000000000000",
    "000000000000",
    "000000066000",
    "000660000000",
    "000000000000",
    "111110000011",
  ],
];

// ---- ゴールチャンク（必ず 4 を含む）----
const goalChunks = [
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "000030000000",
    "111111111411",
  ],
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000040",
    "000000000666",
    "111111111111",
  ],
  [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "111100011141",
  ],
];

// 下6行 → 12行に補完して、数値の2次元配列にする
function expandChunk(chunk) {
  const rows = [];
  for (let i = 0; i < STAGE_H - CHUNK_H; i++) rows.push("0".repeat(CHUNK_W));
  rows.push(...chunk);
  return rows;
}

// 起動時の整合性チェック
function validateChunks() {
  const check = (list, name, mustHave) => {
    list.forEach((ch, i) => {
      if (ch.length !== CHUNK_H) console.warn(`${name}[${i}]: 行数が${CHUNK_H}ではありません`);
      ch.forEach((row, r) => {
        if (row.length !== CHUNK_W) console.warn(`${name}[${i}] row${r}: 幅が${CHUNK_W}ではありません (${row.length})`);
      });
      if (mustHave && !ch.join("").includes(mustHave)) console.warn(`${name}[${i}]: ${mustHave} が含まれていません`);
    });
  };
  check(startChunks, "startChunks", "2");
  check(midChunks, "midChunks", null);
  check(goalChunks, "goalChunks", "4");
}
validateChunks();

// ステージ生成：左右端に透明壁(5)を全行に置き、[start][mid...][goal]を連結
function generateStage(stageNum) {
  const midCount = 2 + stageNum;   // ステージが進むほど長くなる
  const picked = [];

  picked.push(random(startChunks));

  let prev = null;
  for (let i = 0; i < midCount; i++) {
    let c;
    do { c = random(midChunks); } while (c === prev && midChunks.length > 1); // 同じチャンクの連続を避ける
    picked.push(c);
    prev = c;
  }

  picked.push(random(goalChunks));

  const expanded = picked.map(expandChunk);
  const map = [];
  for (let r = 0; r < STAGE_H; r++) {
    let row = [5];                                   // 最初の列：透明壁
    for (const ch of expanded) {
      for (const ch1 of ch[r]) row.push(Number(ch1));
    }
    row.push(5);                                     // 最後の列：透明壁
    map.push(row);
  }
  return map;
}