-- Supabase SQL Editor에서 실행할 테이블 생성 스크립트

-- 1. 플레이어 랭킹 테이블 생성
create table if not exists public.math_rankings (
    id uuid default gen_random_uuid() primary key,
    player_name text not null,
    player_avatar text not null default '⚡',
    game_id text not null,           -- 예: 'triangle-hunter', 'quadrilateral-builder' 등
    unit_name text not null,         -- 예: '3단원. 사각형'
    score integer not null default 0,
    stars integer not null default 1,
    max_streak integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 고속 랭킹 조회를 위한 인덱스 생성
create index if not exists idx_math_rankings_score on public.math_rankings (score desc);
create index if not exists idx_math_rankings_game on public.math_rankings (game_id, score desc);

-- 3. Row Level Security (RLS) 활성화 및 누구나 읽고 쓸 수 있는 정책 설정 (초등 교육용 익명 허용)
alter table public.math_rankings enable row level security;

-- 누구나 랭킹 조회 가능 (SELECT)
create policy "Allow public read-only access"
    on public.math_rankings for select
    using (true);

-- 누구나 점수 등록 가능 (INSERT)
create policy "Allow public insert"
    on public.math_rankings for insert
    with check (true);

-- (선택 사항) 샘플 초기 데이터 3명
insert into public.math_rankings (player_name, player_avatar, game_id, unit_name, score, stars, max_streak)
values 
('번개 타이탄', '⚡', 'quadrilateral-builder', '3단원. 사각형', 1050, 3, 5),
('불꽃 드래곤', '🔥', 'triangle-hunter', '1단원. 삼각형', 980, 3, 4),
('사이버 닌자', '🤖', 'fraction-baking', '2단원. 분수의 덧셈과 뺄셈', 920, 2, 3);
