// storage.js - 3인 플레이어 프로필 및 랭킹전 지원 시스템

const STORAGE_KEY = 'math_battle_4_2_stats_v2';

class MathGameStorage {
  constructor() {
    this.data = this.loadData();
    this.currentPlayerId = this.data.activePlayerId || 'p1';
  }

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Storage load error:", e);
    }
    // 초4 남학생 3명을 위한 기본 프로필 3개 세팅!
    return {
      activePlayerId: 'p1',
      players: {
        p1: { id: 'p1', name: "번개 타이탄", avatar: "⚡", totalStars: 0, totalScore: 0, games: {} },
        p2: { id: 'p2', name: "불꽃 드래곤", avatar: "🔥", totalStars: 0, totalScore: 0, games: {} },
        p3: { id: 'p3', name: "사이버 닌자", avatar: "🤖", totalStars: 0, totalScore: 0, games: {} }
      }
    };
  }

  saveData() {
    try {
      this.data.activePlayerId = this.currentPlayerId;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }

  getCurrentPlayer() {
    if (!this.data.players[this.currentPlayerId]) {
      this.currentPlayerId = 'p1';
    }
    return this.data.players[this.currentPlayerId];
  }

  switchPlayer(playerId) {
    if (this.data.players[playerId]) {
      this.currentPlayerId = playerId;
      this.saveData();
    }
    return this.getCurrentPlayer();
  }

  getAllPlayers() {
    return Object.values(this.data.players);
  }

  // 3인 순위 랭킹 반환 (별점 & 총점 순)
  getLeaderboard() {
    const players = this.getAllPlayers();
    return players.sort((a, b) => {
      if (b.totalStars !== a.totalStars) return b.totalStars - a.totalStars;
      return b.totalScore - a.totalScore;
    });
  }

  getGameRecord(gameId) {
    const player = this.getCurrentPlayer();
    return player.games[gameId] || {
      stars: 0,
      highScore: 0,
      cleared: false,
      playCount: 0,
      lastPlayed: null
    };
  }

  saveGameResult(gameId, score, stars = 3) {
    const player = this.getCurrentPlayer();
    if (!player.games[gameId]) {
      player.games[gameId] = {
        stars: 0,
        highScore: 0,
        cleared: false,
        playCount: 0,
        lastPlayed: null
      };
    }

    const record = player.games[gameId];
    record.playCount = (record.playCount || 0) + 1;
    record.lastPlayed = new Date().toISOString();

    if (score > record.highScore) {
      record.highScore = score;
    }
    if (stars > record.stars) {
      record.stars = Math.min(3, Math.max(record.stars, stars));
    }
    record.cleared = true;

    // 플레이어 전체 별 & 점수 재계산
    let sumStars = 0;
    let sumScore = 0;
    for (const gid in player.games) {
      sumStars += player.games[gid].stars || 0;
      sumScore += player.games[gid].highScore || 0;
    }
    player.totalStars = sumStars;
    player.totalScore = sumScore;

    this.saveData();

    // Supabase 클라우드 랭킹이 설정되어 있으면 실시간 자동 업로드!
    if (window.supabaseRanking && window.supabaseRanking.isReady) {
      window.supabaseRanking.uploadScore(
        player.name,
        player.avatar,
        gameId,
        `단원 게임 (${gameId})`,
        score,
        stars
      );
    }

    return record;
  }

  updatePlayerProfile(playerId, name, avatar) {
    if (this.data.players[playerId]) {
      if (name) this.data.players[playerId].name = name.trim();
      if (avatar) this.data.players[playerId].avatar = avatar;
      this.saveData();
    }
  }
}

window.mathStorage = new MathGameStorage();
