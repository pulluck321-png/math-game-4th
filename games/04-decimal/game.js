// game.js - 4단원 소수의 덧셈과 뺄셈 터보 레이싱 (초4 남학생 배틀 모드)

const GAME_ID = "decimal-runner";

const STAGES = [
  {
    type: "choice",
    category: "1. 소수 둘째 자리 자릿값",
    question: "숫자 0.47에서 ‘7’이 나타내는 실제 값은 무엇일까요?",
    hint: "소수점 아래 첫째 자리는 0.1, 둘째 자리는 0.01 자리입니다!",
    formula: "0.4[7] -> 7의 실제 크기는?",
    choices: ["0.07 (터보 점화!)", "0.7", "7", "0.007"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "2. 소수 셋째 자리 탐색",
    question: "숫자 5.238에서 ‘8’이 나타내는 실제 값은?",
    hint: "소수점 아래 셋째 자리 숫자이므로 0.001이 8개인 수입니다!",
    formula: "5.23[8] -> 8의 실제 크기는?",
    choices: ["0.008 (부스터 분사!)", "0.08", "0.8", "8"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "3. 최고속력 소수 비교",
    question: "두 하이퍼카의 속도 중 더 빠른(더 큰) 소수는?",
    hint: "소수 첫째 자리(6 vs 5)를 먼저 비교하세요! 0.6 = 0.60 입니다.",
    formula: "0.6  vs  0.58",
    choices: ["0.6 이 더 크다 (선두 탈환!)", "0.58 이 더 크다", "둘의 크기가 같다", "알 수 없다"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "4. 소수 둘째 자리 덧셈",
    question: "0.34 + 0.52 의 계산 결과는?",
    hint: "소수점을 맞추고 자릿수끼리 더합니다! (34 + 52 = 86)",
    formula: "0.34 + 0.52 = ?",
    choices: ["0.86 (초고속 질주!)", "0.76", "0.88", "8.6"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "5. 자릿수가 다른 덧셈",
    question: "2.3 + 0.45 의 계산 결과는?",
    hint: "소수점을 똑바로 맞추면 2.30 + 0.45 = 2.75 가 됩니다!",
    formula: "2.3 + 0.45 = 2.30 + 0.45 = ?",
    choices: ["2.75 (라이벌 추월!)", "2.48", "0.68", "2.78"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "6. 받아올림 소수 덧셈",
    question: "0.76 + 0.48 의 계산 결과는?",
    hint: "76 + 48 = 124 이므로 소수점을 찍으면 1.24 가 됩니다!",
    formula: "0.76 + 0.48 = ?",
    choices: ["1.24 (하이퍼 부스터 온!)", "1.14", "1.34", "0.124"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "7. 소수 둘째 자리 뺄셈",
    question: "1.85 - 0.42 의 계산 결과는?",
    hint: "소수점을 맞추고 같은 자리끼리 뺍니다! (1.85 - 0.42 = 1.43)",
    formula: "1.85 - 0.42 = ?",
    choices: ["1.43 (급코너 완벽 주행!)", "1.33", "1.47", "0.43"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "8. 결승선 받아내림 뺄셈",
    question: "3.2 - 1.48 의 계산 결과는? (결승선 체커기 스프린트!)",
    hint: "3.20 - 1.48 로 자릿수를 맞춘 뒤 받아내림하여 뺍니다! (320 - 148 = 172)",
    formula: "3.20 - 1.48 = ?",
    choices: ["1.72 (골인 1위 챔피언!)", "1.82", "2.28", "1.68"],
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
const canvas = document.getElementById('decCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const soundBtn = document.getElementById('soundBtn');
const briefCategory = document.getElementById('briefCategory');
const streakBadge = document.getElementById('streakBadge');
const briefQuestion = document.getElementById('briefQuestion');
const canvasHint = document.getElementById('canvasHint');
const hintToggleBtn = document.getElementById('hintToggleBtn');
const hintCloseBtn = document.getElementById('hintCloseBtn');
const hintText = document.getElementById('hintText');
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

// 힌트 버튼 토글 이벤트
if (hintToggleBtn && canvasHint) {
  hintToggleBtn.addEventListener('click', () => {
    if (window.soundFX) window.soundFX.click();
    canvasHint.classList.remove('hidden');
    hintToggleBtn.style.display = 'none';
  });
}

if (hintCloseBtn && canvasHint) {
  hintCloseBtn.addEventListener('click', () => {
    if (window.soundFX) window.soundFX.click();
    canvasHint.classList.add('hidden');
    if (hintToggleBtn) hintToggleBtn.style.display = 'flex';
  });
}

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

  // 힌트는 바로 제공하지 않고 버튼을 눌러야 보이도록 초기화
  if (hintText) {
    hintText.textContent = `💡 힌트: ${stage.hint}`;
  } else if (canvasHint) {
    canvasHint.textContent = `💡 힌트: ${stage.hint}`;
  }
  if (canvasHint) canvasHint.classList.add('hidden');
  if (hintToggleBtn) hintToggleBtn.style.display = 'flex';

  streakBadge.textContent = `🔥 ${streak} COMBO`;

  actionPanel.innerHTML = '';

  const choiceGrid = document.createElement('div');
  choiceGrid.className = 'choice-grid-4';

  stage.choices.forEach((choice, cIdx) => {
    const btn = document.createElement('button');
    btn.className = 'quad-choice-btn';
    btn.innerHTML = `<span style="color:#fb7185; font-weight:bold;">[${cIdx + 1}]</span> <span>${choice}</span>`;
    btn.addEventListener('click', () => handleChoiceAnswer(cIdx, btn));
    choiceGrid.appendChild(btn);
  });

  actionPanel.appendChild(choiceGrid);
  drawCanvasScene(stage);
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

  damageText.textContent = isCrit ? `🏎️ TURBO CRIT! -${dmg} DMG!` : `⚡ -${dmg} DAMAGE!`;
  damageText.classList.remove('show');
  void damageText.offsetWidth;
  damageText.classList.add('show');
}

function drawCanvasScene(stage) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 사이버 네온 레이싱 트랙 배경
  ctx.save();
  ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
  for (let x = 40; x < canvas.width; x += 40) {
    for (let y = 30; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 트랙 레일
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(80, 240);
  ctx.lineTo(680, 240);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 중앙 수식 및 부스터 게이지
  ctx.save();
  ctx.font = 'bold 38px Jua, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.fillText(stage.formula, 380, 110);

  // 레이싱카 아이콘 (플레이어 vs 라이벌)
  ctx.font = '42px sans-serif';
  ctx.fillText('🏎️', 260, 220); // 플레이어
  ctx.fillText('🏁', 620, 220); // 결승선

  ctx.font = 'bold 22px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('정확한 소수 계산으로 부스터를 밟으세요!', 380, 290);
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
