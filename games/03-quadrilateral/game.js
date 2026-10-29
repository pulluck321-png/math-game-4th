// game.js - 사각형 타이탄 배틀: 메카 몬스터 격파 작전 (초4 남학생 배틀 모드)

const GAME_ID = "quadrilateral-builder";

const STAGES = [
  {
    type: "choice",
    category: "1. 수직 레이저 조준",
    question: "두 직선이 만나서 이루는 각이 직각(90°)일 때, 적의 코어를 뚫는 두 직선의 관계는?",
    hint: "서로 직각으로 만나는 두 직선을 '수직'이라 하고, 한 직선을 다른 직선에 대한 '수선'이라 합니다.",
    drawType: "perpendicular",
    choices: ["서로 수직이다 (크리티컬 빔!)", "서로 평행하다", "서로 빗겨간다", "서로 겹친다"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "2. 평행 레일 캐논 조준",
    question: "평행선 사이의 최단 거리를 정확히 저격하는 올바른 미사일 궤적은?",
    hint: "평행선 사이의 거리는 두 평행선에 '수직인 선분의 길이'로 잽니다.",
    drawType: "parallel_distance",
    choices: ["평행선에 수직인 선분 B (최단거리 관통!)", "기울어진 긴 선분 A", "비스듬한 선분 C", "아무 선분이나 상관없다"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "3. 사다리꼴 실드 돌파",
    question: "‘평행한 변이 한 쌍이라도 있는 사각형’의 정확한 이름은 무엇일까요?",
    hint: "마주 보는 변 중에서 적어도 한 쌍이 평행(나란히)하면 이 도형에 해당합니다.",
    drawType: "trapezoid",
    choices: ["사다리꼴 (1쌍 이상 평행!)", "사다리", "사다리삼각형", "원형"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "4. 평행사변형 파워 측정",
    question: "평행사변형에서 윗변이 9cm, 한 각이 65°일 때, 아랫변의 길이와 마주 보는 각은?",
    hint: "평행사변형은 '마주 보는 변의 길이가 같고', '마주 보는 각의 크기가 같습니다'.",
    drawType: "parallelogram_props",
    choices: ["9cm, 65° (성질 완벽 일치!)", "9cm, 115°", "5cm, 65°", "18cm, 130°"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "5. 마름모 크로스 대각선",
    question: "마름모의 두 대각선이 교차하는 지점의 각도(★)는 몇 도일까요?",
    hint: "마름모의 두 대각선은 서로를 수직(90°)으로 반씩 나눕니다(수직이등분).",
    drawType: "rhombus_diag",
    choices: ["90° (직각 수직이등분!)", "60° (예각)", "120° (둔각)", "180° (평각)"],
    correctIndex: 0
  },
  {
    type: "choice",
    category: "6. 완전체: 정사각형 킹",
    question: "‘네 각이 모두 직각이고, 네 변의 길이가 모두 같은 사각형’은?",
    hint: "직사각형의 성질(네 각 직각)과 마름모의 성질(네 변 같음)을 모두 가진 사각형입니다.",
    drawType: "square_king",
    choices: ["정사각형 (최강의 완전체!)", "직사각형", "마름모", "평행사변형"],
    correctIndex: 0
  },
  {
    type: "ox",
    category: "7. 참/거짓 챌린지 1",
    question: "‘정사각형’은 ‘직사각형’ 가문에 속한다고 부를 수 있을까요?",
    hint: "직사각형의 조건은 '네 각이 모두 직각'이면 됩니다. 정사각형은 네 각이 모두 직각일까요?",
    drawType: "family_tree",
    correctAnswer: true // O
  },
  {
    type: "ox",
    category: "8. 최종 보스 참/거짓",
    question: "‘마름모’는 네 각의 크기가 언제나 항상 4개 모두 같을까요?",
    hint: "마름모는 '네 변의 길이'가 같은 도형이며, 네 각이 모두 같아야 하는 것은 직사각형/정사각형입니다.",
    drawType: "rhombus_angles",
    correctAnswer: false // X
  }
];

let currentStageIndex = 0;
let score = 0;
let streak = 0;
let correctCount = 0;
let isAnswered = false;
let bossMaxHp = 1000;
let bossHp = 1000;

// DOM 요소
const battleArena = document.getElementById('battleArena');
const canvasCard = document.getElementById('canvasCard');
const canvas = document.getElementById('quadCanvas');
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

// 보스 HUD
const hpFill = document.getElementById('hpFill');
const bossHpText = document.getElementById('bossHpText');
const activePlayerBadge = document.getElementById('activePlayerBadge');
const playerAvatar = document.getElementById('playerAvatar');
const playerName = document.getElementById('playerName');

// 결과 모달
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

// 1. 현재 플레이어 로드
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

// 크리티컬 타격 및 화면 흔들림 연출
function triggerHitEffect(isCrit = false) {
  // 1. 화면 흔들림
  battleArena.classList.remove('screen-shake');
  void battleArena.offsetWidth;
  battleArena.classList.add('screen-shake');

  // 2. 보스 피격 사운드
  if (isCrit) {
    window.soundFX.crit();
  } else {
    window.soundFX.boom();
  }

  // 3. 데미지 텍스트 팝업
  const dmg = 125 + (streak * 25);
  bossHp = Math.max(0, bossHp - 125);
  const hpPercent = Math.max(0, Math.round((bossHp / bossMaxHp) * 100));

  hpFill.style.width = `${hpPercent}%`;
  bossHpText.textContent = `HP ${bossHp} / ${bossMaxHp} (${hpPercent}%)`;

  damageText.textContent = isCrit ? `💥 CRITICAL! -${dmg} DMG!` : `⚡ -${dmg} DAMAGE!`;
  damageText.classList.remove('show');
  void damageText.offsetWidth;
  damageText.classList.add('show');
}

// 캔버스 그리기 함수들
function drawCanvasScene(type) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 사이버 네온 그리드
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
    case 'perpendicular':
      drawPerpendicularScene();
      break;
    case 'parallel_distance':
      drawParallelDistanceScene();
      break;
    case 'trapezoid':
      drawTrapezoidScene();
      break;
    case 'parallelogram_props':
      drawParallelogramPropsScene();
      break;
    case 'rhombus_diag':
      drawRhombusDiagScene();
      break;
    case 'square_king':
      drawSquareKingScene();
      break;
    case 'family_tree':
      drawFamilyTreeScene();
      break;
    case 'rhombus_angles':
      drawRhombusAnglesScene();
      break;
  }
}

function drawPerpendicularScene() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(180, 220); ctx.lineTo(580, 220);
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(380, 60); ctx.lineTo(380, 320);
  ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 4; ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(380, 195); ctx.lineTo(405, 195); ctx.lineTo(405, 220);
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.stroke();

  ctx.font = 'bold 22px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('90° (직각 관통!)', 420, 205);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('직선 가 (레일)', 590, 225);
  ctx.fillStyle = '#f43f5e';
  ctx.fillText('직선 나 (수직 캐논)', 380, 45);
  ctx.restore();
}

function drawParallelDistanceScene() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(120, 100); ctx.lineTo(640, 100);
  ctx.moveTo(120, 260); ctx.lineTo(640, 260);
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 4; ctx.stroke();

  drawParallelArrow(300, 100); drawParallelArrow(300, 260);

  ctx.beginPath();
  ctx.moveTo(220, 100); ctx.lineTo(160, 260);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(380, 100); ctx.lineTo(380, 260);
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 5; ctx.setLineDash([]); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(380, 120); ctx.lineTo(400, 120); ctx.lineTo(400, 100);
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(520, 100); ctx.lineTo(580, 260);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]); ctx.stroke();

  ctx.font = 'bold 18px Jua, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('선분 A (기울어짐)', 140, 185);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('선분 B (수직 = 최단거리 저격!)', 395, 185);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('선분 C', 570, 185);
  ctx.restore();
}

function drawParallelArrow(x, y) {
  ctx.save();
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 6); ctx.lineTo(x, y); ctx.lineTo(x - 6, y + 6);
  ctx.moveTo(x, y - 6); ctx.lineTo(x + 6, y); ctx.lineTo(x, y + 6);
  ctx.stroke();
  ctx.restore();
}

function drawTrapezoidScene() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(280, 100); ctx.lineTo(480, 100);
  ctx.lineTo(580, 270); ctx.lineTo(180, 270);
  ctx.closePath();

  ctx.fillStyle = 'rgba(99, 102, 241, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 4; ctx.stroke();

  drawParallelArrow(380, 100); drawParallelArrow(380, 270);

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#c7d2fe'; ctx.textAlign = 'center';
  ctx.fillText('윗변 (평행 실드 가동)', 380, 80);
  ctx.fillText('아랫변 (1쌍 이상 평행하면 사다리꼴!)', 380, 305);
  ctx.restore();
}

function drawParallelogramPropsScene() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(220, 110); ctx.lineTo(500, 110);
  ctx.lineTo(440, 260); ctx.lineTo(160, 260);
  ctx.closePath();

  ctx.fillStyle = 'rgba(16, 185, 129, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 4; ctx.stroke();

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('윗변 = 9 cm', 330, 95);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('아랫변 = ? (9 cm)', 270, 290);

  ctx.fillStyle = '#f43f5e';
  ctx.fillText('65°', 200, 240);
  ctx.fillText('마주 보는 각 = ? (65°)', 420, 140);
  ctx.restore();
}

function drawRhombusDiagScene() {
  ctx.save();
  const cx = 380, cy = 190;
  const rw = 180, rh = 110;

  ctx.beginPath();
  ctx.moveTo(cx, cy - rh); ctx.lineTo(cx + rw, cy);
  ctx.lineTo(cx, cy + rh); ctx.lineTo(cx - rw, cy);
  ctx.closePath();

  ctx.fillStyle = 'rgba(236, 72, 153, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 4; ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - rh); ctx.lineTo(cx, cy + rh);
  ctx.moveTo(cx - rw, cy); ctx.lineTo(cx + rw, cy);
  ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 2.5; ctx.setLineDash([4, 4]); ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(cx, cy - 20); ctx.lineTo(cx + 20, cy - 20); ctx.lineTo(cx + 20, cy);
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.stroke();

  ctx.font = 'bold 22px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('★ 대각선 교차각 = 90°(직각)', cx + 30, cy - 10);
  ctx.restore();
}

function drawSquareKingScene() {
  ctx.save();
  const side = 180;
  const x = 380 - side / 2;
  const y = 190 - side / 2;

  ctx.beginPath();
  ctx.rect(x, y, side, side);
  ctx.fillStyle = 'rgba(251, 191, 36, 0.3)'; ctx.fill();
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 5; ctx.stroke();

  const corner = 20;
  ctx.strokeRect(x, y, corner, corner);
  ctx.strokeRect(x + side - corner, y, corner, corner);
  ctx.strokeRect(x + side - corner, y + side - corner, corner, corner);
  ctx.strokeRect(x, y + side - corner, corner, corner);

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'center';
  ctx.fillText('네 각 모두 직각(90°) + 네 변 길이 모두 같음!', 380, y - 16);
  ctx.fillText('👑 사각형 완전체 킹', 380, y + side + 32);
  ctx.restore();
}

function drawFamilyTreeScene() {
  ctx.save();
  ctx.font = 'bold 18px Jua, sans-serif'; ctx.textAlign = 'center';

  const nodes = [
    { title: "사다리꼴 (평행 1쌍)", x: 170, y: 190, color: "#60a5fa" },
    { title: "평행사변형 (평행 2쌍)", x: 380, y: 190, color: "#34d399" },
    { title: "직사각형 (각 4개 직각)", x: 590, y: 120, color: "#f472b6" },
    { title: "정사각형 (완전체)", x: 590, y: 260, color: "#fbbf24" }
  ];

  nodes.forEach(n => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = n.color; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(n.x - 90, n.y - 25, 180, 50, 12);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = n.color; ctx.fillText(n.title, n.x, n.y + 7);
  });

  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(260, 190); ctx.lineTo(290, 190);
  ctx.moveTo(470, 175); ctx.lineTo(500, 135);
  ctx.moveTo(470, 205); ctx.lineTo(500, 245);
  ctx.moveTo(590, 145); ctx.lineTo(590, 235);
  ctx.stroke();
  ctx.restore();
}

function drawRhombusAnglesScene() {
  ctx.save();
  const cx = 380, cy = 190;
  ctx.beginPath();
  ctx.moveTo(cx, 70); ctx.lineTo(cx + 200, cy);
  ctx.lineTo(cx, 310); ctx.lineTo(cx - 200, cy);
  ctx.closePath();

  ctx.fillStyle = 'rgba(244, 63, 94, 0.25)'; ctx.fill();
  ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 4; ctx.stroke();

  ctx.font = 'bold 20px Jua, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('마름모는 마주 보는 각만 같을 뿐, 4개 각이 모두 같지는 않다!', cx - 180, cy + 90);
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

  // 현재 선수의 계정에 결과 저장!
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

// 초기화
initPlayer();
initSoundBtn();
loadStage(0);
