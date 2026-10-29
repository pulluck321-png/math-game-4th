// main.js - 초4 남학생 3인을 위한 메인 포털 UI 및 실시간 3인 랭킹전 제어

document.addEventListener('DOMContentLoaded', () => {
  let currentFilter = 'all';

  // DOM 요소 캐시
  const gamesGrid = document.getElementById('gamesGrid');
  const filterTabs = document.querySelectorAll('.tab-btn');
  const userStarsEl = document.getElementById('userTotalStars');
  const userAvatarEl = document.getElementById('userAvatarDisplay');
  const userNameEl = document.getElementById('userNameDisplay');
  const totalGamesCountEl = document.getElementById('totalGamesCount');
  const readyGamesCountEl = document.getElementById('readyGamesCount');
  const overallProgressBar = document.getElementById('overallProgressBar');

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const userProfileBtn = document.getElementById('userProfileBtn');
  const addGuideBtn = document.getElementById('addGuideBtn');

  // 3인 플레이어 요소
  const playerTabBtns = document.querySelectorAll('.player-tab-btn');
  const leaderboardList = document.getElementById('leaderboardList');

  // 모달 요소
  const guideModal = document.getElementById('guideModal');
  const profileModal = document.getElementById('profileModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-cancel');
  const profileSaveBtn = document.getElementById('profileSaveBtn');
  const inputPlayerName = document.getElementById('inputPlayerName');
  const avatarChoices = document.querySelectorAll('.avatar-choice');

  let selectedAvatar = '⚡';

  // 1. 프로필 및 스탯 렌더링
  function updateStatsUI() {
    const curPlayer = window.mathStorage.getCurrentPlayer();
    if (userStarsEl) userStarsEl.textContent = curPlayer.totalStars;
    if (userAvatarEl) userAvatarEl.textContent = curPlayer.avatar;
    if (userNameEl) userNameEl.textContent = curPlayer.name;

    const totalGames = MATH_GAMES.length;
    const readyGames = MATH_GAMES.filter(g => g.isReady).length;

    if (totalGamesCountEl) totalGamesCountEl.textContent = totalGames;
    if (readyGamesCountEl) readyGamesCountEl.textContent = readyGames;

    const maxStars = Math.max(1, readyGames * 3);
    const progressPercent = Math.min(100, Math.round((curPlayer.totalStars / maxStars) * 100));

    if (overallProgressBar) overallProgressBar.style.width = `${progressPercent}%`;

    // 3인 선수 탭 활성화 상태 동기화
    playerTabBtns.forEach(btn => {
      const pid = btn.getAttribute('data-player');
      btn.classList.toggle('active', pid === curPlayer.id);
      const p = window.mathStorage.data.players[pid];
      if (p) {
        btn.querySelector('span:first-child').textContent = p.avatar;
        btn.querySelector('.tab-pname').textContent = p.name;
      }
    });

    updateLeaderboardUI();
  }

  // 2. 실시간 랭킹 보드 렌더링 (Supabase 클라우드 또는 로컬 3인 랭킹)
  async function updateLeaderboardUI() {
    if (!leaderboardList) return;

    // 만약 Supabase 클라우드가 활성화되어 있으면 클라우드 랭킹 조회
    if (window.supabaseRanking && window.supabaseRanking.isReady) {
      const cloudRankings = await window.supabaseRanking.getTopRankings(5);
      if (cloudRankings && cloudRankings.length > 0) {
        leaderboardList.innerHTML = '';
        const rankBadges = ['🥇', '🥈', '🥉', '4위', '5위'];
        cloudRankings.forEach((r, idx) => {
          const item = document.createElement('div');
          item.className = `leader-item ${idx === 0 ? 'rank-1' : ''}`;
          item.innerHTML = `
            <div class="leader-left">
              <span class="rank-badge">${rankBadges[idx] || (idx + 1 + '위')}</span>
              <span style="font-size: 1.15rem;">${r.player_avatar}</span>
              <span class="leader-name">${r.player_name}</span>
            </div>
            <div class="leader-right">
              <span class="leader-score">${Number(r.score).toLocaleString()}점</span>
              <span class="leader-stars">⭐ ${r.stars}</span>
            </div>
          `;
          leaderboardList.appendChild(item);
        });
        return;
      }
    }

    // 기본: 3인 로컬 랭킹
    leaderboardList.innerHTML = '';
    const sortedPlayers = window.mathStorage.getLeaderboard();
    const rankBadges = ['🥇', '🥈', '🥉'];

    sortedPlayers.forEach((p, idx) => {
      const item = document.createElement('div');
      item.className = `leader-item ${idx === 0 ? 'rank-1' : ''}`;

      item.innerHTML = `
        <div class="leader-left">
          <span class="rank-badge">${rankBadges[idx]}</span>
          <span style="font-size: 1.15rem;">${p.avatar}</span>
          <span class="leader-name">${p.name}</span>
        </div>
        <div class="leader-right">
          <span class="leader-score">${p.totalScore.toLocaleString()}점</span>
          <span class="leader-stars">⭐ ${p.totalStars}</span>
        </div>
      `;

      item.style.cursor = 'pointer';
      item.title = '이 선수로 플레이 전환';
      item.addEventListener('click', () => {
        window.soundFX.click();
        window.mathStorage.switchPlayer(p.id);
        updateStatsUI();
        renderGames();
      });

      leaderboardList.appendChild(item);
    });
  }

  // 3. 3인 선수 탭 클릭 이벤트
  playerTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundFX.click();
      const pid = btn.getAttribute('data-player');
      window.mathStorage.switchPlayer(pid);
      updateStatsUI();
      renderGames();
    });
  });

  // 4. 게임 카드 목록 렌더링
  function renderGames() {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = '';

    const filteredGames = MATH_GAMES.filter(game => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'ready') return game.isReady;
      if (currentFilter === 'geometry') return game.category === 'geometry';
      if (currentFilter === 'numbers') return game.category === 'numbers';
      if (currentFilter === 'data') return game.category === 'data';
      return true;
    });

    if (filteredGames.length === 0) {
      gamesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #94a3b8;">
          <p style="font-size: 2.5rem; margin-bottom: 12px;">🛸</p>
          <p style="font-family: 'Jua', sans-serif; font-size: 1.2rem;">해당 단원의 게임이 아직 없습니다.</p>
        </div>
      `;
      return;
    }

    filteredGames.forEach(game => {
      const record = window.mathStorage.getGameRecord(game.id);
      const card = document.createElement('div');
      card.className = `game-card ${game.isReady ? '' : 'locked'}`;
      card.setAttribute('data-id', game.id);

      // 별 표시 HTML (3점 만점)
      let starsHtml = '';
      for (let i = 1; i <= 3; i++) {
        starsHtml += `<span class="${i <= record.stars ? 'filled' : ''}">★</span>`;
      }

      card.innerHTML = `
        <div class="card-top">
          <span class="unit-tag-pill">${game.badge || game.unit}</span>
          <span class="status-badge ${game.isReady ? 'ready' : 'coming'}">
            ${game.isReady ? '● 배틀 시작' : '⏳ 오픈 예정'}
          </span>
        </div>

        <div class="card-center-visual">
          <div class="card-square-icon" style="background: ${game.accentGradient};">
            <span>${game.thumbnailIcon}</span>
          </div>
          <h3 class="card-title">${game.title}</h3>
          <span class="card-subtext">${game.unit}</span>
        </div>

        <div class="card-bottom">
          <div class="card-stars" title="획득한 별">
            ${starsHtml}
          </div>
          <span class="quick-play-indicator ${game.isReady ? '' : 'coming'}">
            ${game.isReady ? 'BATTLE ▶' : 'COMING'}
          </span>
        </div>
      `;

      card.addEventListener('mouseenter', () => {
        window.soundFX.hover();
      });

      card.addEventListener('click', () => {
        window.soundFX.click();
        if (game.isReady) {
          window.location.href = game.path;
        } else {
          alert(`✨ [${game.title}]\n\n이 단원의 배틀 게임은 곧 오픈될 예정입니다!\n지금 바로 플레이 가능한 [3단원. 사각형 타이탄 배틀]을 먼저 정복해보세요!`);
        }
      });

      gamesGrid.appendChild(card);
    });
  }

  // 5. 필터 탭 이벤트
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      window.soundFX.click();
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderGames();
    });
  });

  // 6. 사운드 토글
  if (soundToggleBtn) {
    const updateSoundIcon = () => {
      const isEnabled = window.soundFX.isSoundEnabled();
      soundToggleBtn.innerHTML = isEnabled ? '🔊' : '🔇';
      soundToggleBtn.title = isEnabled ? '효과음 켜짐' : '효과음 꺼짐';
    };
    updateSoundIcon();

    soundToggleBtn.addEventListener('click', () => {
      const enabled = window.soundFX.toggleSound();
      updateSoundIcon();
      if (enabled) {
        window.soundFX.crit();
      }
    });
  }

  // 7. 모달 제어
  function openModal(modal) {
    if (!modal) return;
    window.soundFX.click();
    modal.classList.add('open');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
  }

  if (addGuideBtn && guideModal) {
    addGuideBtn.addEventListener('click', () => openModal(guideModal));
  }

  if (userProfileBtn && profileModal) {
    userProfileBtn.addEventListener('click', () => {
      const cur = window.mathStorage.getCurrentPlayer();
      if (inputPlayerName) inputPlayerName.value = cur.name;
      selectedAvatar = cur.avatar;

      avatarChoices.forEach(c => {
        c.classList.toggle('selected', c.getAttribute('data-avatar') === selectedAvatar);
      });

      openModal(profileModal);
    });
  }

  avatarChoices.forEach(c => {
    c.addEventListener('click', () => {
      window.soundFX.click();
      avatarChoices.forEach(item => item.classList.remove('selected'));
      c.classList.add('selected');
      selectedAvatar = c.getAttribute('data-avatar');
    });
  });

  if (profileSaveBtn && profileModal) {
    profileSaveBtn.addEventListener('click', () => {
      window.soundFX.correct();
      const cur = window.mathStorage.getCurrentPlayer();
      const newName = inputPlayerName ? inputPlayerName.value : cur.name;
      window.mathStorage.updatePlayerProfile(cur.id, newName, selectedAvatar);
      updateStatsUI();
      closeModal(profileModal);
    });
  }

  // 클라우드 모달 요소
  const cloudConfigBtn = document.getElementById('cloudConfigBtn');
  const cloudModal = document.getElementById('cloudModal');
  const cloudSaveBtn = document.getElementById('cloudSaveBtn');
  const inputSupabaseUrl = document.getElementById('inputSupabaseUrl');
  const inputSupabaseKey = document.getElementById('inputSupabaseKey');
  const cloudTestResult = document.getElementById('cloudTestResult');
  const cloudStatusText = document.getElementById('cloudStatusText');

  function updateCloudStatusIndicator() {
    if (!cloudStatusText) return;
    if (window.supabaseRanking && window.supabaseRanking.isReady) {
      cloudStatusText.textContent = "🟢 클라우드 ON";
      cloudStatusText.style.color = "#34d399";
    } else {
      cloudStatusText.textContent = "⚪ 로컬 랭킹 모드";
      cloudStatusText.style.color = "#cbd5e1";
    }
  }
  updateCloudStatusIndicator();

  if (cloudConfigBtn && cloudModal) {
    cloudConfigBtn.addEventListener('click', () => {
      const savedUrl = localStorage.getItem('supabase_project_url') || "";
      const savedKey = localStorage.getItem('supabase_anon_key') || "sb_publishable_iN-JSYPjElBJLgi5BTN3Nw_z9uykhia";
      if (inputSupabaseUrl) inputSupabaseUrl.value = savedUrl;
      if (inputSupabaseKey) inputSupabaseKey.value = savedKey;
      if (cloudTestResult) cloudTestResult.textContent = "";
      openModal(cloudModal);
    });
  }

  if (cloudSaveBtn && cloudModal) {
    cloudSaveBtn.addEventListener('click', async () => {
      window.soundFX.click();
      const url = inputSupabaseUrl ? inputSupabaseUrl.value : "";
      const key = inputSupabaseKey ? inputSupabaseKey.value : "";

      if (cloudTestResult) {
        cloudTestResult.textContent = "⏳ Supabase 클라우드 연결 테스트 중...";
        cloudTestResult.style.color = "#38bdf8";
      }

      const res = await window.supabaseRanking.updateConfig(url, key);

      if (res.success) {
        window.soundFX.correct();
        if (cloudTestResult) {
          cloudTestResult.textContent = "✓ 연결 성공! 실시간 클라우드 랭킹이 활성화되었습니다.";
          cloudTestResult.style.color = "#34d399";
        }
        updateCloudStatusIndicator();
        updateStatsUI();
        setTimeout(() => closeModal(cloudModal), 1000);
      } else {
        window.soundFX.wrong();
        if (cloudTestResult) {
          cloudTestResult.textContent = "❌ " + res.message;
          cloudTestResult.style.color = "#f87171";
        }
      }
    });
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundFX.click();
      if (guideModal) closeModal(guideModal);
      if (profileModal) closeModal(profileModal);
      if (cloudModal) closeModal(cloudModal);
    });
  });

  [guideModal, profileModal, cloudModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // 초기화 실행
  updateStatsUI();
  renderGames();
});
