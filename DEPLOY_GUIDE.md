# 🚀 GitHub Pages 배포 & Supabase 클라우드 랭킹 연동 가이드

초등학교 4학년 2학기 수학 웹게임을 인터넷에 무료로 배포하고, 친구들끼리 실시간으로 점수가 저장되는 Supabase 클라우드 DB를 연동하는 방법입니다.

---

## Part 1. Supabase 실시간 랭킹 연동 (무료)

### 1단계: Supabase 프로젝트 생성
1. [https://supabase.com](https://supabase.com) 에 접속하여 무료 회원가입 및 로그인합니다.
2. **[New Project]** 버튼을 누릅니다.
3. 프로젝트 이름(예: `math-game`)과 데이터베이스 비밀번호를 입력하고 리전(Region)은 `Seoul (ap-northeast-2)`을 선택한 후 생성합니다.

### 2단계: 테이블 생성 (SQL 복사 붙여넣기)
1. 왼쪽 메뉴에서 **[SQL Editor]** 아이콘을 클릭합니다.
2. 프로젝트 루트에 있는 `supabase_schema.sql` 파일의 내용을 모두 복사하여 붙여넣고 우측 하단 **[Run]** 버튼을 클릭합니다.
3. `Success. No rows returned` 메시지가 뜨면 `math_rankings` 테이블 생성이 완료됩니다!

### 3단계: API 키 복사하여 연동하기
1. 왼쪽 메뉴 하단 톱니바퀴 **[Project Settings]** -> **[API]** 메뉴로 들어갑니다.
2. 다음 두 가지 값을 복사합니다:
   - **Project URL** (예: `https://abcdefghijkl.supabase.co`)
   - **Project API keys** 의 `anon` / `public` 키 (긴 문자열)
3. 본 프로젝트의 `js/supabase-client.js` 파일을 열고 위 두 값을 붙여넣습니다:
   ```javascript
   const SUPABASE_CONFIG = {
     url: "복사한_Project_URL",
     anonKey: "복사한_anon_키"
   };
   ```
4. 끝! 이제 게임을 클리어할 때마다 자동으로 Supabase DB에 점수가 저장되고 메인 화면 명예의 전당에 실시간 반영됩니다.

---

## Part 2. GitHub & GitHub Pages로 무료 배포하기

이 웹게임은 순수 HTML, CSS, JavaScript로 제작되어 별도의 서버나 빌드 없이 **GitHub Pages**로 1분 만에 웹 호스팅 배포가 가능합니다.

### 1단계: Git 저장소 초기화 및 커밋
VS Code의 터미널(PowerShell)에서 다음 명령어를 실행합니다:

```powershell
# 1. git 저장소 초기화
git init

# 2. 모든 파일 추가
git add .

# 3. 커밋 생성
git commit -m "초등 4학년 2학기 수학 웹게임 완성 (1~6단원 풀세트)"
```

### 2단계: GitHub에 Repository 생성
1. [https://github.com](https://github.com) 에 로그인합니다.
2. 우측 상단 **[+]** -> **[New repository]** 를 클릭합니다.
3. Repository name 에 `math-game-4th` 와 같이 입력하고 **Public** 을 선택한 후 **[Create repository]** 를 누릅니다.

### 3단계: GitHub로 푸시(Push)
생성된 화면에 나오는 명령어 3줄을 터미널에 입력합니다:

```powershell
# 메인 브랜치 설정
git branch -M main

# 본인의 GitHub 저장소 주소 연결 (본인 계정/저장소명으로 변경)
git remote add origin https://github.com/당신의아이디/math-game-4th.git

# 업로드
git push -u origin main
```

### 4단계: GitHub Pages 무료 웹사이트 활성화
1. GitHub 저장소 페이지 상단의 **[Settings]** 탭을 클릭합니다.
2. 왼쪽 사이드바 메뉴에서 **[Pages]** 를 클릭합니다.
3. **Build and deployment** 항목의 **Branch** 섹션에서:
   - `None` 을 **`main`** 으로 변경
   - 폴더는 `/(root)` 그대로 두고 **[Save]** 버튼을 클릭합니다.
4. 약 1~2분 후 상단에 다음과 같은 무료 웹사이트 주소가 생성됩니다:
   👉 **`https://당신의아이디.github.io/math-game-4th/`**

---

### 🎉 완료 후 테스트
- 스마트폰, 태블릿, 다른 컴퓨터 어디서나 위 주소로 접속하면 3명의 아이들이 각자 닉네임을 걸고 실시간 배틀 랭킹을 겨룰 수 있습니다!
