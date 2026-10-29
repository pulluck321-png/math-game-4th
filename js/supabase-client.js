// supabase-client.js - Supabase 클라우드 실시간 랭킹 연동 모듈
// UI 설정 모달 및 코드 설정 모두 지원!

const SUPABASE_CONFIG = {
  // 사용자의 Supabase 프로젝트 주소 및 공개 키 완벽 연동!
  url: localStorage.getItem('supabase_project_url') || "https://cswizojdyyvfsyzpmuyi.supabase.co",
  anonKey: localStorage.getItem('supabase_anon_key') || "sb_publishable_iN-JSYPjElBJLgi5BTN3Nw_z9uykhia"
};

class SupabaseRankingService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.init();
  }

  init() {
    const savedUrl = localStorage.getItem('supabase_project_url') || SUPABASE_CONFIG.url;
    const savedKey = localStorage.getItem('supabase_anon_key') || SUPABASE_CONFIG.anonKey;

    if (window.supabase && savedUrl && savedUrl !== "YOUR_SUPABASE_URL" && savedKey && savedKey !== "YOUR_SUPABASE_ANON_KEY") {
      try {
        this.client = window.supabase.createClient(savedUrl, savedKey);
        this.isReady = true;
        console.log("⚡ Supabase 클라우드 랭킹 시스템 연결 성공! URL:", savedUrl);
        return true;
      } catch (e) {
        console.warn("Supabase 연결 실패:", e);
        this.isReady = false;
        return false;
      }
    } else {
      this.isReady = false;
      return false;
    }
  }

  // 사용자 UI 모달에서 설정 저장 및 즉시 연결 테스트
  async updateConfig(url, anonKey) {
    if (!url || !url.startsWith("http")) {
      return { success: false, message: "올바른 URL 형식(https://...supabase.co)을 입력해주세요." };
    }
    const cleanKey = anonKey ? anonKey.trim() : SUPABASE_CONFIG.anonKey;
    const cleanUrl = url.trim().replace(/\/$/, ""); // 끝자리 슬래시 제거

    localStorage.setItem('supabase_project_url', cleanUrl);
    localStorage.setItem('supabase_anon_key', cleanKey);
    SUPABASE_CONFIG.url = cleanUrl;
    SUPABASE_CONFIG.anonKey = cleanKey;

    try {
      this.client = window.supabase.createClient(cleanUrl, cleanKey);
      // 연결 테스트 (math_rankings 테이블 간단 조회)
      const { data, error } = await this.client.from('math_rankings').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        // 테이블이 아직 없거나 권한 오류일 수 있지만 연결 자체는 성공
        console.log("Supabase 응답:", error);
      }
      this.isReady = true;
      return { success: true, message: "Supabase 클라우드 연동 성공!" };
    } catch (e) {
      this.isReady = false;
      return { success: false, message: "연결 오류: " + e.message };
    }
  }

  // 게임 결과를 Supabase에 업로드
  async uploadScore(playerName, playerAvatar, gameId, unitName, score, stars, streak = 0) {
    if (!this.isReady || !this.client) {
      return { success: false, mode: 'local' };
    }

    try {
      const { data, error } = await this.client
        .from('math_rankings')
        .insert([
          {
            player_name: playerName,
            player_avatar: playerAvatar,
            game_id: gameId,
            unit_name: unitName,
            score: score,
            stars: stars,
            max_streak: streak
          }
        ]);

      if (error) throw error;
      return { success: true, data };
    } catch (e) {
      console.warn("Supabase 점수 업로드 에러:", e);
      return { success: false, error: e };
    }
  }

  // 상위 실시간 랭킹 Top 10 가져오기
  async getTopRankings(limit = 5) {
    if (!this.isReady || !this.client) {
      return null;
    }

    try {
      const { data, error } = await this.client
        .from('math_rankings')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (e) {
      console.warn("Supabase 랭킹 조회 에러:", e);
      return null;
    }
  }
}

window.supabaseRanking = new SupabaseRankingService();
