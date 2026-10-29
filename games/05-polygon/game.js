// game.js - 5단원 다각형 실드 디펜스 (초4 남학생 배틀 모드)

const GAME_ID = "polygon-craft";

const STAGES = [
  {
    type: "choice",
    category: "1. 다각형 실드 판별",
    question: "‘선분으로만 둘러싸인 도형’을 무엇이라고 부를까요?",
    hint: "원처럼 둥근 곡선이 있거나 뚫려 있으면 다각형이 아닙니다!",
    drawType: "polygon_def",
    choices: ["다각형 (실드 활성화!)", "원", "직선", "입체도형"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "2. 변의 개수와 이름",
    question: "변이 6개, 꼭짓점이 6개인 다각형의 이름은?",
    hint: "변의 수가 5개면 오각형, 6개면 육각형, 8개면 팔각형입니다!",
    drawType: "hexagon_intro",
    choices: ["육각형 (블래스터 장전!)", "오각형", "칠각형", "팔각형"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "3. 정다각형의 두 가지 조건",
    question: "‘정다각형’이 되기 위해 반드시 갖추어야 할 두 조건은?",
    hint: "변의 길이만 같아도 안 되고(마름모처럼), 둘 다 완벽히 같아야 합니다!",
    drawType: "regular_poly",
    choices: ["변의 길이가 모두 같고, 각의 크기도 모두 같다", "변의 길이만 같으면 된다", "각의 크기만 같으면 된다", "대각선 개수가 같으면 된다"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "4. 대각선의 개념",
    question: "‘다각형에서 이웃하지 않는 두 꼭짓점을 이은 선분’은?",
    hint: "바로 옆 꼭짓점과 이으면 '변'이 되고, 건너편과 이으면 '대각선'이 됩니다!",
    drawType: "diag_concept",
    choices: ["대각선 (레이저 락온!)", "수선", "평행선", "반직선"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "5. 사각형의 대각선 개수",
    question: "사각형에 그을 수 있는 대각선은 모두 몇 개일까요?",
    hint: "마주 보는 꼭짓점을 X자로 연결해보세요!",
    drawType: "quad_diag",
    choices: ["2개 (크로스 빔 발사!)", "1개", "4개", "3개"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "6. 오각형의 별빛 대각선",
    question: "오각형의 모든 꼭짓점에서 대각선을 그으면 총 몇 개가 될까요?",
    hint: "모든 대각선을 그으면 가운데 예쁜 별(⭐) 모양이 완성됩니다!",
    drawType: "pentagon_star",
    choices: ["5개 (스타 레이저 전개!)", "3개", "10개", "6개"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "7. 육각형 대각선 계산",
    question: "육각형에 그을 수 있는 대각선의 총 개수는?",
    hint: "한 꼭짓점에서 3개씩 그을 수 있습니다. 총 개수는 9개!",
    drawType: "hexagon_diag",
    choices: ["9개 (풀 그리드 레이저!)", "6개", "12개", "8개"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "8. 모양 조각 합체 최종 보스",
    question: "크기가 같은 ‘정삼각형 6개’를 모아 완성할 수 있는 정다각형은?",
    hint: "피자 조각 6개를 모으면 변이 6개인 정다각형이 됩니다!",
    drawType: "tessellation",
    choices: ["정육각형 (최종 코어 파괴!)", "정오각형", "정팔각형", "정사각형"],
    correctIndex: 0
  }
];

let currentStageIndex = 0;
let score = 0;
let streak = 0;
let correctCount = 0;
let isAnswered = false;
let bossMaxHp = 1000;
let bossHp = 1000;

const battleArena = document.getElementById('battleArena');
const canvas = document.getElementById('polyCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const soundBtn = document.getElementById('soundBtn');
const briefCategory = document.getElementById('briefCategory');
const streakBadge = document.getElementById('streakBadge');
const briefQuestion = document.getElementById('briefQuestion');
const canvasHint = document.getElementById('canvasHint');
const actionPanel = document.getElementById('actionPanel');
const damageText = document.getElementById('damageText');

const hpFill = document.getElementById('hpFill');
const bossHpText = document.getElementById('bossHpText');
const playerAvatar = document.getElementById('playerAvatar');
const playerName = document.getElementById('playerName');

const resultModal = document.getElementById('resultModal');
const resultStars = document.getElementById('resultStars');
const finalScore = document.getElementById('finalScore');
const finalStreak = document.getElementById('finalStreak');
const resultPlayerName = document.getElementById('resultPlayerName');
const retryBtn = document.getElementById('retryBtn');

function initPlayer() {
  const cur = window.mathStorage.getCurrentPlayer();
  if (playerAvatar) playerAvatar.textContent = cur.avatar;
  if (playerName) playerName.textContent = cur.name;
  if (resultPlayerName) resultPlayerName.textContent = `${cur.avatar} ${cur.name}`;
}

function initSoundBtn() {
  const isEnabled = window.soundFX.isSoundEnabled();
  soundBtn.innerHTML = isEnabled ? '🔊' : '🔇';
  soundBtn.addEventListener('click', () => {
    const enabled = window.soundFX.toggleSound();
    soundBtn.innerHTML = enabled ? '🔊' : '🔇';
  });
}

function loadStage(index) {
  isAnswered = false;
  const stage = STAGES[index];

  briefCategory.textContent = stage.category;
  briefQuestion.textContent = stage.question;
  canvasHint.textContent = `💡 힌트: ${stage.hint}`;
  streakBadge.textContent = `🔥 ${streak} COMBO`;

  actionPanel.innerHTML = '';

  const choiceGrid = document.createElement('div');
  choiceGrid.className = 'choice-grid-4';

  stage.choices.forEach((choice, cIdx) => {
    const btn = document.createElement('button');
    btn.className = 'quad-choice-btn';
    btn.innerHTML = `<span style="color:#f59e0b; font-weight:bold;">[${cIdx + 1}]</span> <span>${choice}</span>`;
    btn.addEventListener('click', () => handleChoiceAnswer(cIdx, btn));
    choiceGrid.appendChild(btn);
  });

  actionPanel.appendChild(choiceGrid);
  drawCanvasScene(stage.drawType);
}

function triggerHitEffect(isCrit = false) {
  battleArena.classList.remove('screen-shake');
  void battleArena.offsetWidth;
  battleArena.classList.add('screen-shake');

  if (isCrit) {
    window.soundFX.crit();
  } else {
    window.soundFX.boom();
  }

  const dmg = 125 + (streak * 25);
  bossHp = Math.max(0, bossHp - 125);
  const hpPercent = Math.max(0, Math.round((bossHp / bossMaxHp) * 100));

  hpFill.style.width = `${hpPercent}%`;
  bossHpText.textContent = `HP ${bossHp} / ${bossMaxHp} (${hpPercent}%)`;

  damageText.textContent = isCrit ? `🛸 SHIELD CRIT! -${dmg} DMG!` : `⭐ -${dmg} DAMAGE!`;
  damageText.classList.remove('show');
  void damageText.offsetWidth;
  damageText.classList.add('show');
}

function drawCanvasScene(type) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
  for (let x = 40; x < canvas.width; x += 40) {
    for (let y = 30; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  const cx = 380, cy = 190;

  switch (type) {
    case 'polygon_def':
      drawPolygon(cx, cy, 5, 100, '#fbbf24', '오각형 (선분 5개로 둘러싸임)');
      break;
    case 'hexagon_intro':
      drawPolygon(cx, cy, 6, 110, '#34d399', '육각형 (변 6개, 꼭짓점 6개)');
      break;
    case 'regular_poly':
      drawPolygon(cx, cy, 8, 110, '#38bdf8', '정팔각형 (8개 변과 8개 각이 모두 같음)');
      break;
    case 'diag_concept':
      drawDiagConcept(cx, cy);
      break;
    case 'quad_diag':
      drawQuadDiag(cx, cy);
      break;
    case 'pentagon_star':
      drawPentagonStar(cx, cy);
      break;
    case 'hexagon_diag':
      drawHexagonDiags(cx, cy);
      break;
    case 'tessellation':
      drawTessellation(cx, cy);
      break;
  }
}

function drawPolygon(cx, cy, sides, r, color, label) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)'; ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();

  ctx.font = 'bold 22px Jua, sans-serif';
  ctx.fillStyle = '#f8fafc'; ctx.textAlign = 'center';
  ctx.fillText(label, cx, cy + r + 35);
  ctx.restore();
}

function drawDiagConcept(cx, cy) {
  ctx.save();
  const r = 110;
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI / 5) - Math.PI / 2;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }

  // 오각형 외곽선
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3; ctx.stroke();

  // 대각선 1개 강조 (0번 꼭짓점 -> 2번 꼭짓점)
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[2].x, pts[2].y);
  ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 4; ctx.stroke();

  ctx.font = 'bold 20px Jua, sans-serif'; ctx.fillStyle = '#f43f5e'; ctx.textAlign = 'center';
  ctx.fillText('★ 대각선 (이웃하지 않는 꼭짓점 연결!)', cx, cy + 140);
  ctx.restore();
}

function drawQuadDiag(cx, cy) {
  ctx.save();
  const w = 180, h = 130;
  const x1 = cx - w/2, y1 = cy - h/2;
  const x2 = cx + w/2, y2 = cy - h/2;
  const x3 = cx + w/2, y3 = cy + h/2;
  const x4 = cx - w/2, y4 = cy + h/2;

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4;
  ctx.strokeRect(x1, y1, w, h);

  // 대각선 2개
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x3, y3);
  ctx.moveTo(x2, y2); ctx.lineTo(x4, y4);
  ctx.stroke();

  ctx.font = 'bold 22px Jua, sans-serif'; ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'center';
  ctx.fillText('대각선 1', cx - 40, cy - 20);
  ctx.fillText('대각선 2', cx + 40, cy - 20);
  ctx.fillText('사각형의 대각선은 총 2개!', cx, cy + h/2 + 35);
  ctx.restore();
}

function drawPentagonStar(cx, cy) {
  ctx.save();
  const r = 110;
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI / 5) - Math.PI / 2;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }

  // 오각형 외곽선
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.stroke();

  // 모든 5개 대각선
  ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    for (let j = i + 2; j < 5; j++) {
      if (i === 0 && j === 4) continue;
      ctx.beginPath();
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(pts[j].x, pts[j].y);
      ctx.stroke();
    }
  }

  ctx.font = 'bold 22px Jua, sans-serif'; ctx.fillStyle = '#f43f5e'; ctx.textAlign = 'center';
  ctx.fillText('오각형의 모든 대각선 = 별(⭐) 모양 5개!', cx, cy + r + 35);
  ctx.restore();
}

function drawHexagonDiags(cx, cy) {
  ctx.save();
  const r = 110;
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * 2 * Math.PI / 6) - Math.PI / 2;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }

  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3; ctx.stroke();

  // 대각선 9개
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    for (let j = i + 2; j < 6; j++) {
      if (i === 0 && j === 5) continue;
      ctx.beginPath();
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(pts[j].x, pts[j].y);
      ctx.stroke();
    }
  }

  ctx.font = 'bold 22px Jua, sans-serif'; ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'center';
  ctx.fillText('육각형의 대각선 총 개수 = 9개!', cx, cy + r + 35);
  ctx.restore();
}

function drawTessellation(cx, cy) {
  ctx.save();
  const r = 110;
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * 2 * Math.PI / 6) - Math.PI / 2;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }

  // 6개 정삼각형 조각 선 연결
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.fillStyle = 'rgba(251, 191, 36, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4; ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  ctx.font = 'bold 22px Jua, sans-serif'; ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'center';
  ctx.fillText('정삼각형 6개 합체 = 정육각형 완성!', cx, cy + r + 35);
  ctx.restore();
}

function handleChoiceAnswer(chosenIdx, btnElement) {
  if (isAnswered) return;
  isAnswered = true;

  const stage = STAGES[currentStageIndex];
  const allBtns = actionPanel.querySelectorAll('.quad-choice-btn');

  if (chosenIdx === stage.correctIndex) {
    btnElement.classList.add('correct');
    streak++;
    correctCount++;
    const bonus = Math.min(streak * 5, 25);
    score += (100 + bonus);
    triggerHitEffect(streak >= 2);
  } else {
    window.soundFX.wrong();
    btnElement.classList.add('wrong');
    streak = 0;
    allBtns[stage.correctIndex].classList.add('correct');
  }

  scoreDisplay.textContent = score;
  streakBadge.textContent = `🔥 ${streak} COMBO`;

  setTimeout(() => {
    nextStage();
  }, 1300);
}

function nextStage() {
  currentStageIndex++;
  if (currentStageIndex < STAGES.length) {
    loadStage(currentStageIndex);
  } else {
    endGame();
  }
}

function endGame() {
  window.soundFX.fanfare();

  let earnedStars = 1;
  if (correctCount >= 7) earnedStars = 3;
  else if (correctCount >= 5) earnedStars = 2;

  window.mathStorage.saveGameResult(GAME_ID, score, earnedStars);

  finalScore.textContent = `${score}점`;
  finalStreak.textContent = `${streak} COMBO`;

  const starSlots = resultStars.querySelectorAll('.star-slot');
  starSlots.forEach((slot, idx) => {
    if (idx < earnedStars) {
      setTimeout(() => {
        slot.classList.add('active');
        window.soundFX.gem();
      }, (idx + 1) * 350);
    } else {
      slot.classList.remove('active');
    }
  });

  resultModal.classList.add('show');
}

retryBtn.addEventListener('click', () => {
  window.soundFX.click();
  resultModal.classList.remove('show');
  currentStageIndex = 0;
  score = 0;
  streak = 0;
  correctCount = 0;
  bossHp = 1000;
  hpFill.style.width = '100%';
  bossHpText.textContent = `HP 1000 / 1000 (100%)`;
  scoreDisplay.textContent = "0";
  loadStage(0);
});

initPlayer();
initSoundBtn();
loadStage(0);
