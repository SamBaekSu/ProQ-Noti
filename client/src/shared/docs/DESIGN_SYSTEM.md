# ProQ-Noti Design System v2.0

이 문서는 ProQ-Noti 프로젝트의 완전히 리팩토링된 UI/UX 디자인 시스템을 설명합니다.

## 목차

1. [개요](#개요)
2. [색상 시스템](#색상-시스템)
3. [타이포그래피](#타이포그래피)
4. [간격 시스템](#간격-시스템)
5. [컴포넌트](#컴포넌트)
6. [반응형 디자인](#반응형-디자인)
7. [애니메이션](#애니메이션)
8. [접근성](#접근성)
9. [모범 사례](#모범-사례)

---

## 개요

ProQ-Noti는 모바일 우선(Mobile First) 접근 방식으로 완전히 리팩토링된 반응형 디자인 시스템을 제공합니다.

**기술 스택:**
- Tailwind CSS v4 (CSS-first configuration)
- Framer Motion (애니메이션)
- React 19 + Next.js 16
- TypeScript (strict mode)

**핵심 특징:**
- 반응형 레이아웃 (Mobile, Tablet, Desktop)
- 터치 친화적 인터랙션
- WCAG 2.1 AA 접근성 준수
- 성능 최적화된 애니메이션

---

## 색상 시스템

### 기본 색상 팔레트

#### 브랜드 색상 (Primary Colors)

```
Coral (#e95f5c)     - 주요 액션, 강조
Mint (#79ceb8)      - 보조 강조, 성공 상태
Yellow (#ffdb00)    - 경고, 특수 모드
SkyBlue (#5cc3e8)   - 정보, 링크
Navy (#314855)      - 기본 텍스트, 대비
```

#### 색상 변형 (Tints & Shades)

각 기본 색상은 50~900 범위의 10단계 변형을 제공합니다:

```css
--color-coral-50:  #fef7f7;    /* 가장 밝음 */
--color-coral-500: #e95f5c;    /* 기본 */
--color-coral-900: #6d1f1a;    /* 가장 어두움 */
```

#### 중립색 (Neutral Colors)

```
White (#ffffff)     - 배경, 카드
Black (#000000)     - 최대 대비
Gray (50-900)       - 텍스트, 테두리, 배경 변형
```

#### 의미 색상 (Semantic Colors)

```
Success (Green)     - #10b981 - 성공, 완료
Warning (Orange)    - #f59e0b - 주의, 경고
Error (Red)         - #ef4444 - 오류, 위험
Info (Blue)         - #3b82f6 - 정보, 안내
```

### CSS 변수 사용

```css
/* 전역 CSS 변수 접근 */
background-color: var(--color-coral-500);
color: var(--color-navy-900);
border-color: var(--color-gray-200);
```

### Tailwind 클래스 사용

```tsx
<button className="bg-coral-500 text-white hover:bg-coral-600">
  액션 버튼
</button>

<div className="bg-mint-100 border border-mint-200">
  성공 메시지
</div>
```

---

## 타이포그래피

### 폰트 가족

```
Pretendard (기본)   - 본문, UI 텍스트
KCC-Ganpan (디스플레이) - 팀명, 특수 강조
```

### 폰트 크기 스케일

모든 크기는 4px 기본 단위를 사용합니다:

```
xs:    12px (0.75rem)   - 캡션, 작은 텍스트
sm:    14px (0.875rem)  - 라벨, 도움말
base:  16px (1rem)      - 기본 본문
lg:    18px (1.125rem)  - 강조 텍스트
xl:    20px (1.25rem)   - 소제목
2xl:   24px (1.5rem)    - 제목
3xl:   32px (2rem)      - 주요 제목
4xl:   40px (2.5rem)    - 히어로 제목
```

### 폰트 가중치

```
light:        300 - 부차적 텍스트
normal:       400 - 일반 본문
medium:       500 - 강조
semibold:     600 - 버튼, 라벨
bold:         700 - 제목
extrabold:    800 - 특수 강조
```

### 타이포그래피 유틸리티

제공되는 유틸리티 클래스:

```tsx
// 텍스트 스타일 (크기 + 가중치 + 라인높이)
<h1 className="text-heading1">주요 제목</h1>    {/* 24px, bold */}
<h2 className="text-heading2">제목</h2>          {/* 20px, bold */}
<h3 className="text-heading3">소제목</h3>        {/* 18px, semibold */}

<p className="text-body1">기본 본문</p>         {/* 16px, medium */}
<p className="text-body1Bold">강조된 본문</p>    {/* 16px, bold */}

<span className="text-body2">작은 본문</span>    {/* 14px, medium */}
<span className="text-body2Bold">강조된 작은 본문</span> {/* 14px, bold */}

<span className="text-caption">캡션</span>       {/* 12px, medium */}

<button className="text-button">버튼 텍스트</button>  {/* 16px, semibold */}
<button className="text-smallBtn">작은 버튼</button>   {/* 14px, semibold */}
```

### 반응형 타이포그래피

```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl">
  반응형 제목
</h1>

<p className="text-sm sm:text-base md:text-lg">
  반응형 본문
</p>
```

---

## 간격 시스템

### 간격 스케일 (4px 기본 단위)

```
0:    0
1:    4px   (0.25rem)
2:    8px   (0.5rem)
3:    12px  (0.75rem)
4:    16px  (1rem)
5:    20px  (1.25rem)
6:    24px  (1.5rem)
8:    32px  (2rem)
10:   40px  (2.5rem)
12:   48px  (3rem)
16:   64px  (4rem)
20:   80px  (5rem)
24:   96px  (6rem)
```

### 마진 & 패딩

```tsx
{/* 단일 값 */}
<div className="m-4 p-4">
  모든 면에 16px
</div>

{/* 축별 */}
<div className="mx-4 py-6">
  좌우 16px, 위아래 24px
</div>

{/* 반응형 */}
<div className="px-4 sm:px-6 lg:px-8">
  Mobile: 16px, Tablet: 24px, Desktop: 32px
</div>

{/* Gap (Flex/Grid) */}
<div className="flex gap-4 sm:gap-6">
  항목 사이 간격
</div>
```

### 레이아웃 간격 가이드

```
Mobile 패딩:   px-4 (16px)
Tablet 패딩:   px-6 (24px)
Desktop 패딩:  px-8 (32px)

컴포넌트 간격:   gap-3 (12px)
섹션 간격:      gap-6 (24px)
레이아웃 간격:   gap-8 (32px)
```

---

## 컴포넌트

### Layout (레이아웃)

주요 페이지 구조를 정의합니다.

```tsx
<Layout>
  <Layout.Header title="제목" handleBack={handleBack}>
    {/* 커스텀 헤더 콘텐츠 */}
  </Layout.Header>

  <Layout.Main>
    {/* 페이지 콘텐츠 */}
  </Layout.Main>

  <Layout.Footer>
    {/* 푸터 콘텐츠 */}
  </Layout.Footer>
</Layout>
```

**반응형:**
- Header: Mobile 64px → Tablet/Desktop 56px
- Footer: Mobile 80px → Tablet 72px
- Main padding: 16px → 24px → 32px

### IngameBox (게임 정보 카드)

선수의 현재 게임 상태를 표시합니다.

```tsx
<IngameBox
  pro_name="선수명"
  summoner_name="소환사명"
  tag_line="태그라인"
  is_online={true}
  is_subscribed={false}
  isOpen={true}
  onBoxClick={handleClick}
  loggedIn={true}
  puuid="puuid"
  id={1}
  streamer_mode={false}
  last_match_id="matchId"
/>
```

**반응형:**
- Mobile: 전체 너비, 최적화된 터치 크기
- Tablet/Desktop: 최대 너비 제한, 호버 효과

**상태:**
- 로딩 중: 스핀 애니메이션
- 게임 중: 챔피언/스펠/룬 표시
- 아레나 모드: 특수 디자인
- 게임 없음: 상태 메시지

### TeamCard (팀 선택 카드)

```tsx
<TeamCard
  team={team}
  selected={selectedTeam === team.id}
  onClick={handleSelect}
/>
```

**반응형:**
- Mobile: 정사각형 비율, 세로 스택
- Tablet: 중간 크기
- Desktop: 더 큰 카드

**상태:**
- 기본: 흰색 배경, 그림자
- 호버: 배경 변경, 그림자 강화
- 선택됨: 코랄 강조, 테두리

### TeamGrid (팀 그리드)

```tsx
<TeamGrid
  teamList={teams}
  onSelectTeam={handleSelect}
  selectedTeam={selectedTeam}
/>
```

**반응형:**
- Mobile: 2 column
- Tablet: 3 column
- Desktop: 4 column

### SubscribeList (구독 목록)

```tsx
<SubscribeList
  list={playerList}
  emptyState={<CustomEmptyState />}
/>
```

**기능:**
- 확장/축소 가능한 아이템
- 로딩 상태 표시
- 빈 상태 처리
- 터치 및 마우스 지원

### Dropdown (메뉴)

```tsx
<Dropdown />
```

**항목:**
- 메인 화면
- 도움말
- 로그인/로그아웃
- 마이페이지
- 알림 재설정

**반응형:**
- Mobile: 작은 메뉴
- Desktop: 더 넓은 메뉴

### 이미지 컴포넌트

#### ChampionImage (챔피언 아이콘)

```tsx
<ChampionImage
  championId={123}
  size="md"  // 'sm' | 'md' | 'lg'
/>
```

크기: sm(48px), md(64px), lg(96px)

#### SpellImages (스펠 목록)

```tsx
<SpellImages
  spellIds={[1, 2]}
  size="md"
/>
```

#### RuneImages (룬 목록)

```tsx
<RuneImages
  runePaths={[8000, 8100]}
  size="md"
/>
```

### SubscribeSkeleton (로딩 스켈레톤)

```tsx
<SubscribeSkeleton />
```

**특징:**
- Shimmer 애니메이션
- 실제 컴포넌트와 동일한 레이아웃
- 반응형 크기

---

## 반응형 디자인

### 브레이크포인트 (Mobile First)

```
Mobile:   < 640px (sm)
Tablet:   640px - 1024px (md)
Desktop:  >= 1024px (lg)
Wide:     >= 1536px (2xl)
```

### 반응형 클래스

```tsx
{/* 기본값은 모바일 */}
<div className="px-4 sm:px-6 lg:px-8">
  Mobile: 16px | Tablet: 24px | Desktop: 32px
</div>

{/* 문자 크기 */}
<h1 className="text-lg sm:text-xl lg:text-2xl">
  18px → 20px → 24px
</h1>

{/* 그리드 */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
  2열 → 3열 → 4열
</div>

{/* 표시/숨김 */}
<div className="block sm:hidden">Mobile만</div>
<div className="hidden sm:block">Tablet 이상</div>
```

### 터치 최적화

```tsx
{/* 터치 타겟 최소 44x44px */}
<button className="p-2.5 sm:p-2">
  w-10 h-10 (40px) on mobile, 또는 패딩으로 증가
</button>

{/* 터치 친화적 간격 */}
<div className="gap-3 sm:gap-2">
  항목 사이 더 큰 간격
</div>
```

---

## 애니메이션

### 내장 애니메이션

```tsx
{/* 슬라이드 인 */}
<div className="animate-slideindown">
  위에서 아래로 슬라이드 인, 0.5s
</div>

{/* 좋아요 */}
<FaHeart className="animate-like" />
{/* 스케일 1.15x, 1s */}

{/* Shimmer */}
<div className="animate-shimmer">
  로딩 효과, 2s 무한 반복
</div>

{/* 펄스 */}
<div className="animate-pulse">
  투명도 변경, 로딩 상태
</div>

{/* 스핀 */}
<div className="animate-spin">
  회전, 로딩 스피너
</div>
```

### 커스텀 애니메이션

```css
/* CSS에 정의됨 */
@keyframes slide-in-up { /* ... */ }
@keyframes fade-in { /* ... */ }
@keyframes scale-in { /* ... */ }
@keyframes bounce { /* ... */ }
```

### Framer Motion 사용

```tsx
'use client';

import { motion } from 'framer-motion';

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="..."
    >
      콘텐츠
    </motion.div>
  );
}
```

### 성능 최적화

```tsx
{/* 좋음: transform, opacity만 사용 (GPU 가속) */}
<motion.div
  animate={{
    x: 100,
    y: 50,
    scale: 1.2,
    opacity: 0.5
  }}
/>

{/* 피할 것: 레이아웃 변경 */}
<motion.div
  animate={{
    width: 200,  // 리플로우 발생
    height: 100  // 리플로우 발생
  }}
/>
```

---

## 접근성 (a11y)

### WCAG 2.1 AA 준수

#### 색상 대비

```
텍스트 대비:     최소 4.5:1 (작은 텍스트)
큰 텍스트 대비:  최소 3:1 (18px+)
```

예시:
```tsx
{/* 좋음: Navy 텍스트 on 화이트 배경 (대비 높음) */}
<span className="text-navy">텍스트</span>

{/* 피할 것: 회색 텍스트 on 밝은 배경 (대비 낮음) */}
<span className="text-gray-400">텍스트</span>
```

#### 포커스 스타일

```tsx
{/* 모든 인터랙티브 요소에 포커스 링 */}
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-coral
  focus:ring-offset-2
">
  버튼
</button>
```

#### 시맨틱 HTML

```tsx
{/* 좋음 */}
<section aria-labelledby="title">
  <h2 id="title">제목</h2>
  <ul>
    <li>항목</li>
  </ul>
</section>

{/* 피할 것 */}
<div>
  <div>제목</div>
  <div>
    <div>항목</div>
  </div>
</div>
```

#### ARIA 속성

```tsx
{/* 버튼 상태 */}
<button aria-pressed={isOpen}>
  메뉴
</button>

{/* 라이브 리전 */}
<div role="status" aria-live="polite">
  로딩 중...
</div>

{/* 라벨 */}
<button aria-label="검색">
  <SearchIcon />
</button>
```

#### 스크린 리더 전용 텍스트

```tsx
{/* 아이콘만 있는 버튼에 레이블 추가 */}
<button aria-label="닫기">
  <X />
</button>

{/* 또는 sr-only 클래스 사용 */}
<button>
  <span className="sr-only">검색</span>
  <SearchIcon />
</button>
```

---

## 모범 사례

### 1. 클래스 조합 (cn 함수 사용)

```tsx
import { cn } from '@/shared/lib/utils';

export function Button({ variant, disabled }) {
  return (
    <button
      className={cn(
        // 기본 스타일
        'px-4 py-2 rounded-lg font-medium transition-colors',

        // Variant
        {
          'bg-coral text-white': variant === 'primary',
          'bg-gray-100 text-navy': variant === 'secondary',
        },

        // 상태
        {
          'opacity-50 cursor-not-allowed': disabled,
        }
      )}
    >
      버튼
    </button>
  );
}
```

### 2. 반응형 컴포넌트 구조

```tsx
export function Card({ children }) {
  return (
    <div className="
      w-full
      px-4 sm:px-6 lg:px-8
      py-3 sm:py-4 lg:py-6
      rounded-lg sm:rounded-xl
      bg-white
      shadow-sm hover:shadow-md
      transition-shadow
    ">
      {children}
    </div>
  );
}
```

### 3. 로딩 상태 처리

```tsx
export function List({ items, isLoading }) {
  if (isLoading) {
    return <SubscribeSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 4. 에러 상태

```tsx
export function Form() {
  const [error, setError] = useState('');

  return (
    <div>
      <input
        className={cn(
          'border rounded-lg px-4 py-2',
          error && 'border-red-500 bg-red-50'
        )}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
```

### 5. 조건부 렌더링

```tsx
export function UserMenu({ isLoggedIn }) {
  return (
    <nav className="flex gap-2">
      {!isLoggedIn && (
        <Link href="/login" className="text-coral hover:text-coral-600">
          로그인
        </Link>
      )}
      {isLoggedIn && (
        <>
          <Link href="/profile">프로필</Link>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      )}
    </nav>
  );
}
```

### 6. 성능 최적화

```tsx
'use client';

import { memo, useCallback } from 'react';

// 메모이제이션 (React Compiler가 자동으로 처리하기도 함)
export const PlayerCard = memo(function PlayerCard({ player }) {
  const handleClick = useCallback(() => {
    // ...
  }, []);

  return (
    <div onClick={handleClick}>
      {player.name}
    </div>
  );
});

// 동적 임포트 (큰 컴포넌트)
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <SubscribeSkeleton />
});
```

---

## 마이그레이션 가이드

기존 코드를 새 디자인 시스템으로 마이그레이션하는 단계:

### 1단계: 색상 업데이트

```diff
- className="bg-primary-coral"
+ className="bg-coral"

- className="text-primary-navy"
+ className="text-navy"
```

### 2단계: 간격 정규화

```diff
- className="px-7 py-3 gap-5"
+ className="px-6 py-3 gap-4"

- className="w-[20.69rem]"
+ className="w-full max-w-2xl"
```

### 3단계: 반응형 추가

```diff
- className="text-heading2"
+ className="text-heading3 sm:text-heading2"

- className="w-[30rem]"
+ className="w-full sm:max-w-2xl lg:max-w-4xl"
```

### 4단계: 접근성 개선

```diff
  <button
+   className="focus:outline-none focus:ring-2 focus:ring-coral"
+   aria-label="설명"
  >
```

---

## 추가 리소스

- [Tailwind CSS 문서](https://tailwindcss.com)
- [WCAG 2.1 가이드](https://www.w3.org/WAI/WCAG21/quickref/)
- [Framer Motion](https://www.framer.com/motion/)
- [Next.js 이미지 최적화](https://nextjs.org/docs/app/api-reference/components/image)

---

**마지막 업데이트:** 2025년 2월

**유지보수:** UI/UX 전문가 담당
