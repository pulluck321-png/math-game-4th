// game.js - 6단원 꺾은선그래프 사이버 해킹 작전 (초4 남학생 배틀 모드)

const GAME_ID = "line-graph-meteor";

const STAGES = [
  {
    type: "choice",
    category: "1. 데이터 그래프 판별",
    question: "‘수량을 점으로 찍고 선분으로 이어 연속적인 시간 변화를 나타낸 그래프’는?",
    hint: "시간에 따라 기온이나 키가 쑥쑥 자라는 모습을 보기에 가장 좋습니다!",
    drawType: "intro_line",
    choices: ["꺾은선그래프 (해킹 툴 실행!)", "막대그래프", "그림그래프", "원그래프"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "2. 꺾은선 vs 막대그래프",
    question: "시간의 흐름에 따른 ‘연속적인 변화의 모습’을 가장 잘 파악할 수 있는 그래프는?",
    hint: "막대그래프는 양의 크기 비교, 꺾은선그래프는 변화하는 추세 파악에 최고입니다!",
    drawType: "compare_graphs",
    choices: ["꺾은선그래프 (트렌드 분석 완료!)", "막대그래프", "달력", "표"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "3. 눈금 한 칸 크기 해킹",
    question: "세로 눈금 0부터 10까지가 5칸으로 나누어져 있습니다. 한 칸의 크기는?",
    hint: "10 ÷ 5 = 2! 눈금 한 칸은 2를 나타냅니다.",
    drawType: "grid_scale",
    choices: ["2 (정밀 데이터 추출!)", "1", "5", "10"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "4. 물결선(생략선)의 비밀",
    question: "꺾은선그래프에서 아래쪽에 물결 모양 선(〰️)을 사용하는 가장 큰 이유는?",
    hint: "수량이 0인 쓸데없는 공간을 줄여서, 변화하는 모습을 훨씬 크고 뚜렷하게 보기 위함입니다!",
    drawType: "wave_line",
    choices: ["필요 없는 부분을 줄여 변화를 더 뚜렷하게 보기 위해", "예쁘게 장식하기 위해", "데이터가 0임을 숨기기 위해", "선이 부족해서"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "5. 가장 가파른 급변 구간",
    question: "화면의 꺾은선그래프에서 ‘변화가 가장 큰 구간’은 어디일까요?",
    hint: "선분의 기울기가 가장 가파르게 위로 치솟거나 떨어진 구간을 찾으세요!",
    drawType: "steepest_segment",
    choices: ["2시 ~ 3시 (가장 가파른 급상승 구간!)", "1시 ~ 2시", "3시 ~ 4시", "4시 ~ 5시"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "6. 수평선(평평한 선)의 의미",
    question: "꺾은선그래프에서 선분이 가로로 평평하게 이어진 구간의 의미는?",
    hint: "높이가 그대로 유지되었으므로 수량의 변화가 없다는 뜻입니다!",
    drawType: "flat_segment",
    choices: ["수량의 변화가 없다 (일정하다)", "수량이 0이 되었다", "데이터가 삭제되었다", "가장 빠르게 변했다"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "7. 그래프 그리기 프로세스",
    question: "꺾은선그래프를 그릴 때 가장 마지막에 수행하는 단계는?",
    hint: "가로/세로 눈금을 정하고 -> 점을 찍고 -> 마지막에 점들을 선분으로 잇습니다!",
    drawType: "draw_order",
    choices: ["점들을 선분으로 잇는다 (네트워크 연결!)", "가로와 세로 눈금을 정한다", "제목을 붙인다", "점을 찍는다"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "8. 미래 데이터 예측 최종 보스",
    question: "오전 9시(15°) -> 11시(19°) -> 13시(23°)로 계속 상승 중일 때, 14시의 예상 기온은?",
    hint: "기온의 변화 경향이 지속적으로 올라가고 있으므로 13시보다 더 높을 것으로 예측됩니다!",
    drawType: "predict_future",
    choices: ["23°보다 더 높을 것이다 (서버 완전 셧다운!)", "23°보다 훨씬 낮을 것이다", "0°가 될 것이다", "알 수 없다"],
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
const canvas = document.getElementById('graphCanvas');
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
    btn.innerHTML = `<span style="color:#38bdf8; font-weight:bold;">[${cIdx + 1}]</span> <span>${choice}</span>`;
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

  damageText.textContent = isCrit ? `💻 OVERCLOCK CRIT! -${dmg} DMG!` : `⚡ -${dmg} DAMAGE!`;
  damageText.classList.remove('show');
  void damageText.offsetWidth;
  damageText.classList.add('show');
}

function drawCanvasScene(type) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
  for (let x = 40; x < canvas.width; x += 40) {
    for (let y = 30; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  switch (type) {
    case 'intro_line':
      drawLineGraphDemo([14, 18, 22, 21, 26], ['10시', '11시', '12시', '13시', '14시'], '시간별 기온 변화 (꺾은선그래프)');
      break;
    case 'compare_graphs':
      drawLineGraphDemo([10, 15, 25, 20, 30], ['1월', '2월', '3월', '4월', '5월'], '연속적인 변화 추세를 한눈에 파악!');
      break;
    case 'grid_scale':
      drawScaleDemo();
      break;
    case 'wave_line':
      drawWaveDemo();
      break;
    case 'steepest_segment':
      drawSteepestDemo();
      break;
    case 'flat_segment':
      drawFlatDemo();
      break;
    case 'draw_order':
      drawOrderDemo();
      break;
    case 'predict_future':
      drawPredictDemo();
      break;
  }
}

function drawLineGraphDemo(data, labels, title) {
  const originX = 160, originY = 270;
  const stepX = 110;
  const maxVal = 30;
  const scaleY = 160 / maxVal;

  ctx.save();
  // 축
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(originX, 70); ctx.lineTo(originX, originY); ctx.lineTo(originX + 460, originY);
  ctx.stroke();

  // 포인트 & 선
  const pts = data.map((val, idx) => ({
    x: originX + (idx + 0.5) * stepX,
    y: originY - val * scaleY,
    val: val,
    lbl: labels[idx]
  }));

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4;
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // 점 찍기
  pts.forEach(p => {
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

    ctx.font = 'bold 15px Outfit, sans-serif'; ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'center';
    ctx.fillText(`${p.val}°`, p.x, p.y - 12);

    ctx.font = '14px Jua, sans-serif'; ctx.fillStyle = '#94a3b8';
    ctx.fillText(p.lbl, p.x, originY + 22);
  });

  ctx.font = 'bold 22px Jua, sans-serif'; ctx.fillStyle = '#f8fafc'; ctx.textAlign = 'center';
  ctx.fillText(title, 380, 50);
  ctx.restore();
}

function drawScaleDemo() {
  ctx.save();
  const ox = 300, oy = 270;
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox, 70); ctx.lineTo(ox, oy); ctx.stroke();

  for (let i = 0; i <= 5; i++) {
    const y = oy - i * 36;
    ctx.beginPath();
    ctx.moveTo(ox - 10, y); ctx.lineTo(ox + 10, y); ctx.stroke();
    ctx.font = 'bold 16px Outfit, sans-serif'; ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'right';
    if (i === 0) ctx.fillText('0', ox - 18, y + 5);
    if (i === 5) ctx.fillText('10', ox - 18, y + 5);
  }

  ctx.font = 'bold 22px Jua, sans-serif'; ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left';
  ctx.fillText('0부터 10까지 5칸으로 분할', ox + 30, 150);
  ctx.fillText('한 칸의 크기 = 10 ÷ 5 = 2 !', ox + 30, 190);
  ctx.restore();
}

function drawWaveDemo() {
  ctx.save();
  const ox = 220, oy = 270;
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox, 70); ctx.lineTo(ox, oy); ctx.lineTo(ox + 360, oy); ctx.stroke();

  // 물결선 그리기
  const wy = oy - 40;
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox - 10, wy);
  ctx.bezierCurveTo(ox + 5, wy - 8, ox + 15, wy + 8, ox + 30, wy);
  ctx.stroke();

  ctx.font = 'bold 22px Jua, sans-serif'; ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'left';
  ctx.fillText('〰️ 물결선 (생략선)', ox + 45, wy + 7);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('필요 없는 0~30 구간을 생략하여', ox + 45, wy + 45);
  ctx.fillText('변화하는 모습을 확대해서 보여줍니다!', ox + 45, wy + 75);
  ctx.restore();
}

function drawSteepestDemo() {
  const data = [10, 12, 28, 29, 31];
  const labels = ['1시', '2시', '3시', '4시', '5시'];
  drawLineGraphDemo(data, labels, '2시~3시 사이에 가파른 급상승! (가장 큰 변화)');
}

function drawFlatDemo() {
  const data = [15, 20, 20, 20, 24];
  const labels = ['1시', '2시', '3시', '4시', '5시'];
  drawLineGraphDemo(data, labels, '2시~4시 구간은 수평! (수량의 변화가 없음)');
}

function drawOrderDemo() {
  ctx.save();
  ctx.font = 'bold 20px Jua, sans-serif'; ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('1단계: 가로와 세로 눈금의 단위를 정한다', 380, 110);
  ctx.fillText('2단계: 데이터 값에 맞추어 점을 찍는다', 380, 160);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('3단계 (마지막): 점들을 선분으로 잇는다! ⭐', 380, 220);
  ctx.restore();
}

function drawPredictDemo() {
  const data = [15, 19, 23];
  const labels = ['9시', '11시', '13시'];
  drawLineGraphDemo(data, labels, '지속적인 상승 추세 -> 14시는 더 높을 것으로 예측!');
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
