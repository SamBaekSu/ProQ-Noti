# ProQ-Noti 디자인 시스템 빠른 참고서

빠르게 참고할 수 있는 색상, 크기, 컴포넌트 치트시트입니다.

## 색상 팔레트

### 브랜드 색상

| 색상 | 코드 | Tailwind | 용도 |
|-----|------|----------|------|
| 🔴 Coral | #e95f5c | `coral-500` | 액션, 강조, 버튼 |
| 🟢 Mint | #79ceb8 | `mint-500` | 보조 강조, 성공 |
| 🟡 Yellow | #ffdb00 | `yellow-500` | 경고, 특수 모드 |
| 🔵 SkyBlue | #5cc3e8 | `skyblue-500` | 정보, 링크 |
| ⬛ Navy | #314855 | `navy-900` | 텍스트, 배경 |

### 중립색

| 색상 | 코드 | Tailwind | 용도 |
|-----|------|----------|------|
| ⚪ White | #ffffff | `white` | 배경, 카드 |
| ⬜ Gray-100 | #f3f4f6 | `gray-100` | 배경 변형 |
| ⬜ Gray-200 | #e5e7eb | `gray-200` | 테두리 |
| ⬜ Gray-500 | #6b7280 | `gray-500` | 2차 텍스트 |
| ⬛ Gray-900 | #111827 | `gray-900` | 최대 대비 텍스트 |

### 의미 색상

| 색상 | Tailwind | 용도 |
|-----|----------|------|
| ✅ Success | `green-500` | 성공, 완료 |
| ⚠️ Warning | `orange-500` | 경고, 주의 |
| ❌ Error | `red-500` | 오류, 위험 |
| ℹ️ Info | `blue-500` | 정보, 안내 |

---

## 타이포그래피

### 텍스트 크기 (클래스)

| 클래스 | 크기 | 가중치 | 라인높이 | 용도 |
|-------|------|-------|---------|------|
| `text-xs` | 12px | 400 | 1.4 | 캡션, 작은 도움말 |
| `text-sm` | 14px | 400 | 1.5 | 라벨, 작은 텍스트 |
| `text-base` | 16px | 400 | 1.5 | 기본 본문 |
| `text-lg` | 18px | 400 | 1.5 | 강조된 텍스트 |
| `text-caption` | 12px | 500 | 1.4 | 캡션 |
| `text-body2` | 14px | 500 | 1.6 | 작은 본문 |
| `text-body1` | 16px | 500 | 1.6 | 기본 본문 |
| `text-smallBtn` | 14px | 600 | 1.4 | 작은 버튼 |
| `text-button` | 16px | 600 | 1.4 | 버튼 텍스트 |
| `text-heading3` | 18px | 600 | 1.4 | 소제목 |
| `text-heading2` | 20px | 700 | 1.3 | 제목 |
| `text-heading1` | 24px | 700 | 1.3 | 주요 제목 |

### 반응형 텍스트

```tsx
{/* 모바일 → 태블릿 → 데스크톱 */}
<h1 className="text-xl sm:text-2xl lg:text-3xl">
  {/* 20px → 24px → 32px */}
</h1>

<p className="text-sm sm:text-base lg:text-lg">
  {/* 14px → 16px → 18px */}
</p>
```

---

## 간격 시스템

### 기본 간격 값

| Tailwind | px | 용도 |
|----------|-----|------|
| `p-1` `m-1` | 4px | 매우 작은 간격 |
| `p-2` `m-2` | 8px | 작은 간격 |
| `p-3` `m-3` | 12px | 기본 간격 |
| `p-4` `m-4` | 16px | 기본 패딩 |
| `p-6` `m-6` | 24px | 큰 간격 |
| `p-8` `m-8` | 32px | 매우 큰 간격 |
| `gap-3` | 12px | 요소 간 기본 간격 |
| `gap-4` | 16px | 요소 간 중간 간격 |
| `gap-6` | 24px | 요소 간 큰 간격 |

### 반응형 패딩

```tsx
{/* 모바일 → 태블릿 → 데스크톱 */}
<div className="px-4 sm:px-6 lg:px-8">
  {/* 16px → 24px → 32px */}
</div>

<div className="py-3 sm:py-4 lg:py-6">
  {/* 12px → 16px → 24px */}
</div>
```

---

## 반응형 가이드

### 브레이크포인트

```
  ┌─────────────┬────────────────┬──────────────┐
  │   Mobile    │     Tablet     │   Desktop    │
  │   < 640px   │ 640px - 1024px │  > 1024px    │
  └─────────────┴────────────────┴──────────────┘
  (기본값)         sm:             lg:
```

### 클래스 패턴

```tsx
{/* 모바일 먼저 작성 */}
className="
  grid-cols-2           /* 모바일: 2열 */
  sm:grid-cols-3        /* 태블릿: 3열 */
  lg:grid-cols-4        /* 데스크톱: 4열 */
"
```

### 자주 사용되는 패턴

```tsx
{/* 전체 너비, 반응형 패딩 */}
className="w-full px-4 sm:px-6 lg:px-8"

{/* 최대 너비, 중앙 정렬 */}
className="max-w-4xl mx-auto"

{/* 반응형 그리드 */}
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"

{/* 반응형 텍스트 + 패딩 */}
className="text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3"

{/* 반응형 높이 */}
className="h-16 sm:h-14 lg:h-12"
```

---

## 컴포넌트 치트시트

### Layout 사용법

```tsx
<Layout>
  <Layout.Header title="제목" handleBack={handleBack} />
  <Layout.Main>
    {/* 콘텐츠 */}
  </Layout.Main>
  <Layout.Footer>
    {/* 선택 사항 */}
  </Layout.Footer>
</Layout>
```

### IngameBox 기본 사용

```tsx
<IngameBox
  pro_name="선수명"
  summoner_name="소환사명"
  tag_line="태그"
  is_online={true}
  is_subscribed={false}
  isOpen={isOpen}
  onBoxClick={handleClick}
  loggedIn={true}
  puuid="puuid"
  id={1}
  streamer_mode={false}
  last_match_id="matchId"
/>
```

### TeamCard 기본 사용

```tsx
<TeamCard
  team={team}
  selected={selected === team.id}
  onClick={() => setSelected(team.id)}
/>
```

### TeamGrid 기본 사용

```tsx
<TeamGrid
  teamList={teams}
  selectedTeam={selected}
  onSelectTeam={handleSelect}
/>
```

### SubscribeList 기본 사용

```tsx
<SubscribeList
  list={playerList}
  emptyState={<CustomEmpty />}
/>
```

### 이미지 컴포넌트 크기

```tsx
{/* ChampionImage */}
<ChampionImage championId={1} size="md" />

{/* SpellImages */}
<SpellImages spellIds={[1, 2]} size="md" />

{/* RuneImages */}
<RuneImages runePaths={[8000, 8100]} size="md" />
```

**크기 옵션:** `sm` (20-48px) | `md` (24-64px) | `lg` (32-96px)

---

## 버튼 패턴

### 기본 버튼

```tsx
<button className="
  px-4 py-2
  bg-coral text-white
  rounded-lg
  hover:bg-coral-600
  focus:ring-2 focus:ring-coral
  transition-colors
">
  버튼
</button>
```

### 보조 버튼

```tsx
<button className="
  px-4 py-2
  bg-gray-100 text-navy
  rounded-lg
  hover:bg-gray-200
  focus:ring-2 focus:ring-coral
  transition-colors
">
  보조 버튼
</button>
```

### 아이콘 버튼

```tsx
<button className="
  p-2
  hover:bg-gray-100
  focus:ring-2 focus:ring-coral
  rounded-lg
"
  aria-label="설명"
>
  <Icon size={24} />
</button>
```

---

## 카드 패턴

### 기본 카드

```tsx
<div className="
  bg-white
  border border-gray-200
  rounded-lg
  p-4 sm:p-6
  shadow-sm hover:shadow-md
  transition-shadow
">
  콘텐츠
</div>
```

### 상태별 카드

```tsx
{/* 성공 */}
<div className="bg-mint-100 border border-mint-200 rounded-lg p-4">
  성공 메시지
</div>

{/* 경고 */}
<div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4">
  경고 메시지
</div>

{/* 오류 */}
<div className="bg-red-100 border border-red-200 rounded-lg p-4">
  오류 메시지
</div>
```

---

## 애니메이션

### 내장 애니메이션

```tsx
{/* 슬라이드 인 */}
<div className="animate-slideindown">
  위에서 아래로 슬라이드 (0.5s)
</div>

{/* 펄스 (로딩) */}
<div className="animate-pulse">
  로딩 상태
</div>

{/* 스핀 (회전) */}
<div className="animate-spin">
  로딩 스피너
</div>

{/* 좋아요 (하트) */}
<Heart className="animate-like" />
```

---

## 접근성 체크리스트

### 필수 항목

- [ ] 모든 인터랙티브 요소에 `aria-label` 또는 텍스트
- [ ] 포커스 스타일: `focus:ring-2 focus:ring-coral`
- [ ] 색상 대비: 텍스트/배경 4.5:1 이상
- [ ] 키보드 접근: Tab, Enter, Space 지원
- [ ] 시맨틱 HTML: `<button>`, `<a>`, `<section>` 등

### 예시

```tsx
{/* 좋음: 아이콘 + aria-label */}
<button aria-label="검색">
  <SearchIcon />
</button>

{/* 좋음: 포커스 스타일 */}
<button className="focus:ring-2 focus:ring-coral focus:outline-none">
  버튼
</button>

{/* 나쁨: 아이콘만, 라벨 없음 */}
<button>
  <SearchIcon />
</button>

{/* 나쁨: 색상 대비 낮음 */}
<span className="text-gray-400">약한 텍스트</span>
```

---

## cn() 함수 사용법

조건부 스타일을 위한 클래스 합병 함수:

```tsx
import { cn } from '@/shared/lib/utils';

<button className={cn(
  // 기본 스타일
  'px-4 py-2 rounded-lg font-medium transition-colors',

  // 조건부 variant
  {
    'bg-coral text-white hover:bg-coral-600': variant === 'primary',
    'bg-gray-100 text-navy hover:bg-gray-200': variant === 'secondary',
    'border border-coral text-coral': variant === 'outline',
  },

  // 조건부 상태
  {
    'opacity-50 cursor-not-allowed': disabled,
    'scale-95': pressed,
  }
)}>
  버튼
</button>
```

---

## 마이그레이션 체크리스트

기존 코드 업데이트:

```diff
// 색상
- className="text-primary-navy"
+ className="text-navy-900"

- className="bg-primary-coral"
+ className="bg-coral-500"

// 크기
- className="w-[20.69rem] web:w-[30rem]"
+ className="w-full max-w-2xl lg:max-w-3xl"

// 패딩
- className="px-7 py-3"
+ className="px-6 py-3 sm:px-8 sm:py-4"

// 반응형
- className="web:text-base mobile:text-sm"
+ className="text-sm sm:text-base"

// 그리드
- className="grid grid-cols-2"
+ className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
```

---

## 유용한 팁

### 1. 반응형 헬퍼

```tsx
// 모바일에서만 보이기
<div className="block sm:hidden">Mobile only</div>

// 태블릿 이상에서만 보이기
<div className="hidden sm:block">Tablet+</div>

// 데스크톱에서만 보이기
<div className="hidden lg:block">Desktop only</div>
```

### 2. 터치 최적화

```tsx
// 최소 터치 타겟 44x44px 유지
<button className="p-2.5">  {/* 40x40px + 4px padding = 48x48px */}
  버튼
</button>
```

### 3. 로딩 상태

```tsx
{loading ? (
  <div className="animate-spin rounded-full border-b-2 border-coral" />
) : (
  <div>콘텐츠</div>
)}
```

### 4. 에러 표시

```tsx
<input className={cn(
  'border rounded-lg px-4 py-2',
  error && 'border-red-500 bg-red-50'
)} />
{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
```

---

## 자주 묻는 질문

**Q: 색상 변형은 어떻게 사용하나?**
A: `coral-50` (밝음) ~ `coral-900` (어두움)를 배경, 호버, 텍스트 등에 사용합니다.

**Q: 모바일 먼저는 무엇인가?**
A: 기본 클래스가 모바일 크기이고, `sm:`, `lg:` 등으로 큰 화면에서만 변경합니다.

**Q: cn() 함수는 필수인가?**
A: 조건부 스타일이 없으면 필수 아니지만, 복잡한 스타일에는 권장합니다.

**Q: 다크모드를 지원하나?**
A: 현재 기본 지원은 아니지만, CSS 변수로 쉽게 추가 가능합니다.

---

**마지막 업데이트:** 2025년 2월
**버전:** 2.0 (완전 리팩토링)
