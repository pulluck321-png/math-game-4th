// game.js - 2단원 분수의 덧셈과 뺄셈 마법전 배틀 (초4 남학생 배틀 모드)

const GAME_ID = "fraction-baking";

const STAGES = [
  {
    type: "choice",
    category: "1. 기초 포션 조합",
    question: "2/7 + 3/7 마법 포션을 합치면 어떤 파워가 될까요?",
    hint: "분모(7)는 그대로 두고 분자(2 + 3 = 5)끼리 더합니다!",
    formula: "2/7 + 3/7 = ?",
    visual: { type: "add", den: 7, n1: 2, n2: 3 },
    choices: ["5/7 (파이어볼 발사!)", "5/14", "6/7", "1/7"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "2. 완전한 1의 힘",
    question: "3/8 포션과 5/8 포션을 합치면 완성되는 값은?",
    hint: "3/8 + 5/8 = 8/8 입니다. 분자와 분모가 같으면 '1'이 됩니다!",
    formula: "3/8 + 5/8 = ?",
    visual: { type: "add", den: 8, n1: 3, n2: 5 },
    choices: ["1 (완전한 8/8 마법 충전!)", "8/16", "2", "6/8"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "3. 대분수 변환 크리티컬",
    question: "4/5 + 3/5 의 계산 결과를 대분수로 바르게 나타낸 것은?",
    hint: "4/5 + 3/5 = 7/5 = 5/5 + 2/5 = 1과 2/5 입니다!",
    formula: "4/5 + 3/5 = 7/5 = ?",
    visual: { type: "add", den: 5, n1: 4, n2: 3 },
    choices: ["1과 2/5 (강화 주문 발동!)", "1과 3/5", "2와 1/5", "7/10"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "4. 대분수 덧셈 파워",
    question: "1과 2/6 + 2와 3/6 의 마법 연산 결과는?",
    hint: "자연수는 자연수끼리(1 + 2 = 3), 분수는 분수끼리(2/6 + 3/6 = 5/6) 더합니다!",
    formula: "1과 2/6 + 2와 3/6 = ?",
    visual: { type: "mixed_add" },
    choices: ["3과 5/6 (아이스 볼트!)", "3과 5/12", "4와 1/6", "2와 5/6"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "5. 받아올림 대분수 덧셈",
    question: "1과 4/7 + 2와 5/7 = 3과 9/7 입니다. 올바른 대분수는?",
    hint: "9/7 = 1과 2/7 이므로 자연수 3에 1을 더해 4와 2/7이 됩니다!",
    formula: "3과 9/7 = 3 + 1과 2/7 = ?",
    visual: { type: "carry_add" },
    choices: ["4과 2/7 (메테오 스트라이크!)", "3과 2/7", "4와 5/7", "5와 1/7"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "6. 진분수 감산 주문",
    question: "6/9 마법 에너지에서 2/9 를 소모하고 남은 양은?",
    hint: "분모(9)는 그대로 두고 분자(6 - 2 = 4)를 뺍니다!",
    formula: "6/9 - 2/9 = ?",
    visual: { type: "sub", den: 9, n1: 6, n2: 2 },
    choices: ["4/9 (포션 정제 성공!)", "4/0", "8/9", "3/9"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "7. 숫자 1에서 빼기",
    question: "1 - 3/5 를 계산하면 얼마일까요?",
    hint: "숫자 1을 분모가 5인 가분수 '5/5'로 바꿔서 빼보세요! (5/5 - 3/5)",
    formula: "1 - 3/5 = 5/5 - 3/5 = ?",
    visual: { type: "sub_from_one" },
    choices: ["2/5 (실드 브레이크!)", "3/5", "1/5", "4/5"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "8. 받아내림 대분수 최종 보스",
    question: "3과 1/4 - 1과 3/4 = ? (자연수 3에서 1을 빌려오기!)",
    hint: "3과 1/4 = 2와 5/4 로 변환! 2와 5/4 - 1과 3/4 = 1과 2/4 = 1과 1/2",
    formula: "2와 5/4 - 1과 3/4 = ?",
    visual: { type: "borrow_sub" },
    choices: ["1과 2/4 (또는 1과 1/2) (최후의 마법 결착!)", "2와 2/4", "1과 1/4", "2와 1/4"],
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

// DOM
const battleArena = document.getElementById('battleArena');
const canvas = document.getElementById('fracCanvas');
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
    btn.innerHTML = `<span style="color:#c084fc; font-weight:bold;">[${cIdx + 1}]</span> <span>${choice}</span>`;
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

  damageText.textContent = isCrit ? `✨ MAGIC CRIT! -${dmg} DMG!` : `🔮 -${dmg} DAMAGE!`;
  damageText.classList.remove('show');
  void damageText.offsetWidth;
  damageText.classList.add('show');
}

function drawCanvasScene(stage) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 마법진 별빛 배경
  ctx.save();
  ctx.fillStyle = 'rgba(192, 132, 252, 0.15)';
  for (let x = 40; x < canvas.width; x += 40) {
    for (let y = 30; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 중앙 포션 막대 게이지 및 수식 렌더링
  ctx.save();
  ctx.font = 'bold 36px Jua, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.fillText(stage.formula, 380, 110);

  // 시각화 바 렌더링
  const barWidth = 460;
  const barHeight = 44;
  const barX = (canvas.width - barWidth) / 2;
  const barY = 160;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, barHeight, 14);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;
  ctx.stroke();

  if (stage.visual.den) {
    const den = stage.visual.den;
    const segW = barWidth / den;
    for (let i = 0; i < den; i++) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(barX + i * segW, barY);
      ctx.lineTo(barX + i * segW, barY + barHeight);
      ctx.stroke();
    }

    if (stage.visual.n1) {
      // 1번째 부분 채우기
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, segW * stage.visual.n1, barHeight, [14, 0, 0, 14]);
      ctx.fill();
    }
    if (stage.visual.n2) {
      // 2번째 부분 채우기
      ctx.fillStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.beginPath();
      ctx.rect(barX + segW * stage.visual.n1, barY, segW * stage.visual.n2, barHeight);
      ctx.fill();
    }
  } else {
    // 대분수/받아올림 그래픽
    ctx.fillStyle = 'linear-gradient(90deg, #a855f7, #38bdf8)';
    ctx.font = 'bold 24px Jua, sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText('마법 포션 연금술 반응 진행 중...', 380, barY + 30);
  }

  ctx.font = 'bold 22px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('정확한 분수 값을 선택하여 주문을 완성하세요!', 380, 270);
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
