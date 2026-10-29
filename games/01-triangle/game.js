// game.js - 1단원 삼각형 헌터: 드래곤 슬레이어 (초4 남학생 배틀 모드)

const GAME_ID = "triangle-hunter";

const STAGES = [
  {
    type: "choice",
    category: "1. 이등변삼각형 타격",
    question: "‘두 변의 길이가 같은 삼각형’의 정확한 이름은 무엇일까요?",
    hint: "같을 이(二), 등(等), 변(邊)! 두 변의 길이가 같아서 이등변삼각형입니다.",
    drawType: "isosceles_intro",
    choices: ["이등변삼각형 (드래곤 슬래시!)", "정삼각형", "직각삼각형", "부등변삼각형"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "2. 정삼각형 파워 차지",
    question: "세 변의 길이가 모두 같고 세 각의 크기가 모두 60°인 완벽한 삼각형은?",
    hint: "바를 정(正)! 세 변과 세 각이 모두 완벽하게 같은 삼각형입니다.",
    drawType: "equilateral_intro",
    choices: ["정삼각형 (풀파워 크리티컬!)", "이등변삼각형", "둔각삼각형", "사다리꼴"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "3. 이등변삼각형 각도 계산",
    question: "이등변삼각형의 꼭지각이 80°일 때, 길이가 같은 두 변의 밑각(★) 크기는?",
    hint: "삼각형의 세 각의 합은 180°! (180° - 80°) ÷ 2 를 계산해보세요.",
    drawType: "isosceles_angle",
    choices: ["각각 50° (약점 타격!)", "각각 60°", "각각 40°", "각각 80°"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "4. 예각삼각형 판별",
    question: "다음 중 세 각이 모두 예각(0°보다 크고 90°보다 작음)인 삼각형은?",
    hint: "단 하나라도 직각(90°)이나 둔각(90° 초과)이 있으면 안 됩니다!",
    drawType: "acute_tri",
    choices: ["예각삼각형 (관통 레이저!)", "직각삼각형", "둔각삼각형", "평각삼각형"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "5. 직각삼각형 급소 공격",
    question: "한 각이 직각(90°)인 삼각형의 올바른 이름은?",
    hint: "각도기의 90° 표시가 하나 들어가 있는 삼각형입니다.",
    drawType: "right_tri",
    choices: ["직각삼각형 (헤드샷 타격!)", "예각삼각형", "둔각삼각형", "정삼각형"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "6. 둔각삼각형 맹공",
    question: "한 각의 크기가 90°보다 큰 둔각(예: 110°)이 있는 삼각형은?",
    hint: "한 각이 활짝 벌어져 있는 삼각형을 말합니다.",
    drawType: "obtuse_tri",
    choices: ["둔각삼각형 (메가 슬래시!)", "예각삼각형", "직각삼각형", "이등변삼각형"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "7. 세 각(30°, 60°, 90°) 정밀 조준",
    question: "세 각의 크기가 30°, 60°, 90°인 삼각형은 어떤 삼각형일까요?",
    hint: "90° 직각이 하나 있으므로 직각삼각형입니다!",
    drawType: "right_30_60",
    choices: ["직각삼각형 (급소 명중!)", "예각삼각형", "둔각삼각형", "정삼각형"],
    correctIndex: 0
  },
  {
    type: "ox",
    category: "8. 최종 보스 참/거짓",
    question: "‘정삼각형’은 ‘이등변삼각형’이라고 부를 수 있을까요?",
    hint: "이등변삼각형 조건: 두 변의 길이가 같으면 됨! 정삼각형은 세 변이 같으니 두 변도 당연히 같습니다!",
    drawType: "tri_family",
    correctAnswer: true // O
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
const canvas = document.getElementById('triCanvas');
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

  if (stage.type === 'ox') {
    const oxGrid = document.createElement('div');
    oxGrid.className = 'ox-grid';

    const btnO = document.createElement('button');
    btnO.className = 'ox-btn btn-o';
    btnO.innerHTML = `<span>⭕ 그렇다 (O)</span><span class="ox-sub">참(True) 공격!</span>`;
    btnO.addEventListener('click', () => handleOXAnswer(true, btnO));

    const btnX = document.createElement('button');
    btnX.className = 'ox-btn btn-x';
    btnX.innerHTML = `<span>❌ 아니다 (X)</span><span class="ox-sub">거짓(False) 방어!</span>`;
    btnX.addEventListener('click', () => handleOXAnswer(false, btnX));

    oxGrid.appendChild(btnO);
    oxGrid.appendChild(btnX);
    actionPanel.appendChild(oxGrid);
  } else {
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
  }

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

  damageText.textContent = isCrit ? `🐉 CRITICAL! -${dmg} DMG!` : `⚔️ -${dmg} DAMAGE!`;
  damageText.classList.remove('show');
  void damageText.offsetWidth;
  damageText.classList.add('show');
}

function drawCanvasScene(type) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 드래곤 던전 아케이드 도트
  ctx.save();
  ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
  for (let x = 40; x < canvas.width; x += 40) {
    for (let y = 30; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  switch (type) {
    case 'isosceles_intro':
      drawIsosceles(380, 80, 260, 290, 500, 290, "7 cm", "7 cm", "5 cm");
      break;
    case 'equilateral_intro':
      drawEquilateral(380, 70, 160);
      break;
    case 'isosceles_angle':
      drawIsoscelesAngles();
      break;
    case 'acute_tri':
      drawAcuteScene();
      break;
    case 'right_tri':
      drawRightScene();
      break;
    case 'obtuse_tri':
      drawObtuseScene();
      break;
    case 'right_30_60':
      drawRight3060Scene();
      break;
    case 'tri_family':
      drawTriFamilyScene();
      break;
  }
}

function drawIsosceles(topX, topY, leftX, leftY, rightX, rightY, leftLabel, rightLabel, bottomLabel) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(topX, topY); ctx.lineTo(leftX, leftY); ctx.lineTo(rightX, rightY); ctx.closePath();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.stroke();

  // 변의 일치 기호(||)
  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(leftLabel, (topX + leftX) / 2 - 40, (topY + leftY) / 2);
  ctx.fillText(rightLabel, (topX + rightX) / 2 + 15, (topY + rightY) / 2);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(bottomLabel, topX - 15, leftY + 28);
  ctx.restore();
}

function drawEquilateral(cx, cy, side) {
  const h = side * (Math.sqrt(3) / 2);
  const x1 = cx, y1 = cy;
  const x2 = cx - side, y2 = cy + h * 1.5;
  const x3 = cx + side, y3 = cy + h * 1.5;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath();
  ctx.fillStyle = 'rgba(251, 191, 36, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4; ctx.stroke();

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.fillText('세 변의 길이가 모두 8cm로 같음!', cx, cy - 15);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('60°', cx, cy + 50);
  ctx.fillText('60°', x2 + 50, y2 - 15);
  ctx.fillText('60°', x3 - 50, y3 - 15);
  ctx.restore();
}

function drawIsoscelesAngles() {
  const topX = 380, topY = 70, leftX = 240, leftY = 280, rightX = 520, rightY = 280;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(topX, topY); ctx.lineTo(leftX, leftY); ctx.lineTo(rightX, rightY); ctx.closePath();
  ctx.fillStyle = 'rgba(16, 185, 129, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 4; ctx.stroke();

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#f43f5e';
  ctx.textAlign = 'center';
  ctx.fillText('꼭지각 80°', topX, topY + 45);

  ctx.fillStyle = '#fbbf24';
  ctx.fillText('★ = ?', leftX + 45, leftY - 15);
  ctx.fillText('★ = ?', rightX - 45, rightY - 15);
  ctx.fillText('(두 밑각의 크기는 서로 같음!)', topX, leftY + 30);
  ctx.restore();
}

function drawAcuteScene() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(380, 80); ctx.lineTo(260, 270); ctx.lineTo(500, 270); ctx.closePath();
  ctx.fillStyle = 'rgba(99, 102, 241, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 4; ctx.stroke();

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#a5b4fc'; ctx.textAlign = 'center';
  ctx.fillText('70° (예각)', 380, 130);
  ctx.fillText('55° (예각)', 310, 250);
  ctx.fillText('55° (예각)', 450, 250);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('세 각이 모두 90°보다 작은 예각!', 380, 305);
  ctx.restore();
}

function drawRightScene() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(260, 80); ctx.lineTo(260, 270); ctx.lineTo(520, 270); ctx.closePath();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#f87171'; ctx.lineWidth = 4; ctx.stroke();

  ctx.strokeRect(260, 246, 24, 24);

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('직각(90°)', 295, 255);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('한 각이 직각이면 직각삼각형!', 390, 160);
  ctx.restore();
}

function drawObtuseScene() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(220, 140); ctx.lineTo(460, 260); ctx.lineTo(600, 260); ctx.closePath();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 4; ctx.stroke();

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('120° (둔각: 90° 초과)', 410, 230);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('한 각이 둔각이면 둔각삼각형!', 360, 110);
  ctx.restore();
}

function drawRight3060Scene() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(280, 90); ctx.lineTo(280, 270); ctx.lineTo(540, 270); ctx.closePath();
  ctx.fillStyle = 'rgba(16, 185, 129, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 4; ctx.stroke();

  ctx.strokeRect(280, 246, 24, 24);

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('90°', 315, 255);
  ctx.fillText('60°', 300, 130);
  ctx.fillText('30°', 480, 255);
  ctx.restore();
}

function drawTriFamilyScene() {
  ctx.save();
  ctx.font = 'bold 20px Jua, sans-serif'; ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('정삼각형은 세 변의 길이가 모두 같습니다.', 380, 120);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('따라서 두 변의 길이가 같은 ‘이등변삼각형’의 조건을 100% 만족합니다!', 380, 170);
  ctx.fillStyle = '#34d399';
  ctx.fillText('정삼각형은 이등변삼각형이라고 부를 수 있습니다! (⭕ 참)', 380, 230);
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

function handleOXAnswer(userChoice, btnElement) {
  if (isAnswered) return;
  isAnswered = true;

  const stage = STAGES[currentStageIndex];
  const isCorrect = (userChoice === stage.correctAnswer);

  if (isCorrect) {
    btnElement.style.boxShadow = "0 0 25px rgba(16, 185, 129, 0.8)";
    streak++;
    correctCount++;
    score += (100 + Math.min(streak * 5, 25));
    triggerHitEffect(true);
  } else {
    window.soundFX.wrong();
    btnElement.style.boxShadow = "0 0 25px rgba(239, 68, 68, 0.8)";
    streak = 0;
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
