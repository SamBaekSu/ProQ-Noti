# UI 컴포넌트 구현 가이드

ProQ-Noti의 리팩토링된 UI 컴포넌트를 사용하기 위한 상세 가이드입니다.

## 빠른 시작

### 설치 및 설정

모든 컴포넌트는 이미 설정되어 있으며 `@/shared/ui/` 경로에서 사용할 수 있습니다.

```tsx
import { Layout } from '@/shared/ui/Layout';
import IngameBox from '@/shared/ui/IngameBox';
import { TeamCard } from '@/shared/ui/TeamCard';
import { TeamGrid } from '@/shared/ui/TeamGrid';
import SubscribeList from '@/shared/ui/subscribeList';
import { cn } from '@/shared/lib/utils';
```

---

## 컴포넌트 상세 가이드

### 1. Layout (페이지 구조)

```tsx
'use client';

import { Layout } from '@/shared/ui/Layout';
import { useState } from 'react';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout>
      {/* Header */}
      <Layout.Header
        title="페이지 제목"
        handleBack={() => window.history.back()}
      />

      {/* Main Content */}
      <Layout.Main>
        {isLoading ? (
          <div>로딩 중...</div>
        ) : (
          <div>메인 콘텐츠</div>
        )}
      </Layout.Main>

      {/* Footer (Optional) */}
      <Layout.Footer>
        <button className="w-full bg-coral text-white py-2 rounded-lg">
          액션 버튼
        </button>
      </Layout.Footer>
    </Layout>
  );
}
```

**Props:**
- `Header.title?: string` - 헤더 제목
- `Header.handleBack?: () => void` - 뒤로가기 핸들러
- `Header.children?: ReactNode` - 커스텀 헤더 콘텐츠
- `Header.option?: ReactNode` - 제목 우측 옵션
- `Main.className?: string` - 추가 CSS 클래스
- `Footer.className?: string` - 추가 CSS 클래스

**반응형 동작:**
- Mobile: Header 64px, Footer 80px, padding 16px
- Tablet+: Header 56px, Footer 72px, padding 24-32px

---

### 2. IngameBox (게임 정보)

프로게이머의 실시간 게임 정보를 표시합니다.

```tsx
import IngameBox from '@/shared/ui/IngameBox';
import { useState } from 'react';

export default function GameInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <IngameBox
      pro_name="프로 선수명"
      summoner_name="소환사명"
      tag_line="태그"
      is_online={true}
      is_subscribed={false}
      isOpen={isOpen}
      onBoxClick={() => setIsOpen(!isOpen)}
      loggedIn={true}
      puuid="puuid-값"
      id={1}
      streamer_mode={false}
      last_match_id="match-id"
    />
  );
}
```

**Props 설명:**
- `pro_name: string` - 프로 선수 이름
- `summoner_name: string` - 게임 소환사 이름
- `tag_line: string` - 태그라인
- `is_online: boolean` - 온라인 여부
- `is_subscribed: boolean` - 구독 여부
- `isOpen: boolean` - 전개 상태
- `onBoxClick: () => void` - 클릭 핸들러
- `loggedIn: boolean` - 로그인 여부
- `puuid: string` - Riot PUUID
- `id: number` - 선수 ID
- `streamer_mode: boolean` - 스트리머 모드 (최근 전적 표시)
- `last_match_id: string` - 최근 매치 ID

**상태:**
- **기본**: 선수명, 온라인 상태, 구독 버튼 표시
- **전개됨**: 게임 정보, 챔피언, 스펠, 룬 표시
- **로딩**: 스핀 애니메이션
- **아레나 모드**: 특수 메시지
- **게임 없음**: "현재 게임 중이 아닙니다" 메시지

**카스터마이징:**

```tsx
// 구독 버튼 커스텀 스타일
<IngameBox
  {...props}
  // 컴포넌트 내부에서 스타일 조정 필요
/>
```

---

### 3. TeamCard (팀 카드)

개별 팀 선택 카드입니다.

```tsx
import { TeamCard } from '@/shared/ui/TeamCard';

export default function TeamSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <TeamCard
      team={{
        id: 1,
        name_prefix: 'T1',
        name_suffix: '',
        name_abbr: 'T1',
        // ... 다른 팀 속성
      }}
      selected={selected === 'T1'}
      onClick={() => setSelected('T1')}
    />
  );
}
```

**Props:**
- `team: Team` - 팀 데이터 객체
- `onClick?: () => void` - 클릭 핸들러
- `selected?: boolean` - 선택 여부
- `disabled?: boolean` - 비활성화 여부

**스타일링:**
- **기본**: 흰색 배경, 회색 테두리, 약간의 그림자
- **호버**: 배경 밝아짐, 코랄 테두리 색상
- **선택됨**: 코랄 강조, 더 두꺼운 테두리
- **비활성화**: 투명도 50%, 포인터 금지

**반응형:**
- Mobile: 정사각형, 텍스트 14px
- Tablet: 약간 더 큼, 텍스트 16px
- Desktop: 더 큼, 텍스트 18px

---

### 4. TeamGrid (팀 그리드)

여러 팀을 그리드로 표시합니다.

```tsx
import { TeamGrid } from '@/shared/ui/TeamGrid';
import { useState } from 'react';

export default function TeamSelection() {
  const [selected, setSelected] = useState<string | null>(null);
  const teams = [
    { id: 1, name_prefix: 'T1', name_suffix: '', name_abbr: 'T1' },
    { id: 2, name_prefix: 'GEN', name_suffix: '', name_abbr: 'GEN' },
    // ... 더 많은 팀
  ];

  return (
    <TeamGrid
      teamList={teams}
      selectedTeam={selected}
      onSelectTeam={(abbr) => {
        setSelected(abbr);
        // 선택 처리
      }}
    />
  );
}
```

**Props:**
- `teamList: Team[]` - 팀 배열
- `onSelectTeam: (abbr: string) => void` - 선택 콜백
- `selectedTeam?: string | null` - 선택된 팀 약자

**레이아웃:**
- Mobile: 2 column (gap-3)
- Tablet: 3 column (gap-4)
- Desktop: 4 column (gap-6)

**접근성:**
- `role="group"` 및 `aria-label` 포함

---

### 5. SubscribeList (구독 목록)

구독한 프로게이머 목록입니다.

```tsx
'use client';

import SubscribeList from '@/shared/ui/subscribeList';
import SubscribeSkeleton from '@/shared/ui/SubscribeSkeleton';
import { useQuery } from '@tanstack/react-query';

export default function SubscriptionsPage() {
  const { data: players, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const res = await fetch('/api/subscriptions');
      return res.json();
    }
  });

  if (isLoading) {
    return <SubscribeSkeleton />;
  }

  return (
    <SubscribeList
      list={players || []}
      emptyState={
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            구독한 선수가 없습니다
          </p>
          <p className="text-sm text-gray-500 mt-2">
            프로게이머를 구독하면 실시간 게임 정보를 받을 수 있습니다
          </p>
        </div>
      }
    />
  );
}
```

**Props:**
- `list: IProPlayerData[]` - 선수 데이터 배열
- `onUnsubscribe?: (proId: number) => void` - 구독 해제 콜백
- `emptyState?: ReactNode` - 빈 상태 커스텀 콘텐츠

**기능:**
- 각 항목 전개/축소 가능
- 외부 클릭으로 닫힘
- 로딩 상태 자동 처리
- 빈 상태 표시

---

### 6. Dropdown (메뉴)

네비게이션 메뉴입니다.

```tsx
import Dropdown from '@/shared/ui/dropdown';

export default function Header() {
  return (
    <header>
      <h1>ProQ Noti</h1>
      <Dropdown />
    </header>
  );
}
```

**기본 항목:**
- 메인 화면 (링크)
- 도움말 (외부 링크)
- 로그인 (미로그인 시에만)
- 마이페이지 (로그인 시에만)
- 로그아웃 (로그인 시에만)
- 알림 재설정 (로그인 시에만)

**메뉴 커스터마이징:**

현재는 하드코딩되어 있으나, 다음과 같이 확장할 수 있습니다:

```tsx
// src/shared/ui/dropdown.tsx 수정
const menuItems = [
  { label: '커스텀 항목', href: '/custom' },
  // ...
];
```

---

### 7. 이미지 컴포넌트

#### ChampionImage

```tsx
import ChampionImage from '@/shared/ui/ChampionImage';

export default function Champion() {
  return (
    <ChampionImage
      championId={1}     // 챔피언 ID
      size="md"          // 'sm' | 'md' | 'lg'
      className="border-2 border-coral"  // 추가 스타일
    />
  );
}
```

**크기:**
- sm: 48px
- md: 64px (기본)
- lg: 96px

#### SpellImages

```tsx
import SpellImages from '@/shared/ui/SpellImages';

export default function Spells() {
  return (
    <SpellImages
      spellIds={[1, 2]}  // 스펠 ID 배열
      size="md"          // 기본: md (24px)
    />
  );
}
```

#### RuneImages

```tsx
import RuneImages from '@/shared/ui/RuneImages';

export default function Runes() {
  return (
    <RuneImages
      runePaths={[8000, 8100]}  // 룬 경로 배열
      size="md"                  // 기본: md (24px)
    />
  );
}
```

---

### 8. SubscribeSkeleton (로딩)

로딩 상태를 표시합니다.

```tsx
import SubscribeSkeleton from '@/shared/ui/SubscribeSkeleton';

export default function LoadingPage() {
  return <SubscribeSkeleton />;
}
```

**특징:**
- 5개의 더미 항목 표시
- Shimmer 애니메이션
- 실제 컴포넌트와 동일한 레이아웃
- 반응형 크기

---

## 일반적인 사용 사례

### 1. 페이지 레이아웃 구성

```tsx
'use client';

import { Layout } from '@/shared/ui/Layout';
import SubscribeList from '@/shared/ui/subscribeList';
import SubscribeSkeleton from '@/shared/ui/SubscribeSkeleton';
import { useQuery } from '@tanstack/react-query';

export default function SubscribePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const res = await fetch('/api/players');
      return res.json();
    }
  });

  return (
    <Layout>
      <Layout.Header title="구독 목록" handleBack={() => {}} />
      <Layout.Main>
        {isLoading ? (
          <SubscribeSkeleton />
        ) : (
          <SubscribeList list={data || []} />
        )}
      </Layout.Main>
    </Layout>
  );
}
```

### 2. 팀 선택 페이지

```tsx
'use client';

import { Layout } from '@/shared/ui/Layout';
import { TeamGrid } from '@/shared/ui/TeamGrid';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamSelect() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const teams = [
    // 팀 데이터...
  ];

  const handleSelectTeam = (abbr: string) => {
    setSelected(abbr);
    // API 호출 또는 라우팅
    router.push(`/team/${abbr}`);
  };

  return (
    <Layout>
      <Layout.Header title="팀 선택" handleBack={() => router.back()} />
      <Layout.Main>
        <TeamGrid
          teamList={teams}
          selectedTeam={selected}
          onSelectTeam={handleSelectTeam}
        />
      </Layout.Main>
    </Layout>
  );
}
```

### 3. 반응형 카드 목록

```tsx
'use client';

import IngameBox from '@/shared/ui/IngameBox';
import { useState } from 'react';

export default function GameList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const games = [
    // 게임 데이터...
  ];

  return (
    <div className="
      flex flex-col gap-3 sm:gap-4
      px-4 sm:px-6 lg:px-8
      py-4 sm:py-6
      max-w-4xl mx-auto
    ">
      {games.map((game, index) => (
        <IngameBox
          key={game.id}
          {...game}
          isOpen={openIndex === index}
          onBoxClick={() => {
            setOpenIndex(openIndex === index ? null : index);
          }}
        />
      ))}
    </div>
  );
}
```

---

## 스타일링 팁

### cn() 함수로 조건부 스타일

```tsx
import { cn } from '@/shared/lib/utils';

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium',
        {
          'bg-mint-100 text-mint-900': status === 'online',
          'bg-gray-100 text-gray-900': status === 'offline',
          'bg-yellow-100 text-yellow-900': status === 'gaming',
        }
      )}
    >
      {status}
    </span>
  );
}
```

### 반응형 유틸리티 조합

```tsx
<div className="
  grid
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  gap-4 sm:gap-6 lg:gap-8
  px-4 sm:px-6 lg:px-8
  py-4 sm:py-6 lg:py-8
">
  {/* 항목들 */}
</div>
```

### 상태별 스타일

```tsx
export function Button({ disabled, loading, variant }) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        // 기본
        'px-4 py-2 rounded-lg font-medium transition-all',
        // variant
        variant === 'primary' && 'bg-coral text-white hover:bg-coral-600',
        // 상태
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        loading && 'animate-pulse'
      )}
    >
      {loading ? '로딩...' : '버튼'}
    </button>
  );
}
```

---

## 접근성 체크리스트

컴포넌트를 사용할 때 다음을 확인하세요:

- [ ] 인터랙티브 요소에 `aria-label` 또는 `aria-labelledby` 추가
- [ ] 색상만으로 정보를 전달하지 않음 (아이콘 또는 텍스트 병행)
- [ ] 키보드로 모든 기능 접근 가능
- [ ] 충분한 색상 대비 (4.5:1 이상)
- [ ] 포커스 순서가 논리적
- [ ] 링크와 버튼을 올바르게 구분

---

## 성능 최적화

### 이미지 최적화

```tsx
// 외부 API 이미지는 unoptimized 사용 (필요 시)
<Image
  src="https://cdn.example.com/image.png"
  alt="설명"
  width={100}
  height={100}
  unoptimized={true}  // 동적 이미지의 경우
/>

// 또는 priority 사용
<Image
  src="/logo.png"
  alt="로고"
  width={100}
  height={100}
  priority={true}  // 위에 보이는 이미지
/>
```

### 컴포넌트 메모이제이션

```tsx
import { memo } from 'react';

export const PlayerCard = memo(function PlayerCard({ player }) {
  return (
    <div className="...">
      {player.name}
    </div>
  );
});
```

### 동적 임포트

```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('./HeavyChart'),
  { loading: () => <div>로딩 중...</div> }
);
```

---

## 문제 해결

### 스타일이 적용되지 않음

1. Tailwind CSS가 올바르게 설정되었는지 확인
2. 클래스명이 동적으로 생성되지 않는지 확인
3. `globals.css`가 임포트되었는지 확인

```tsx
// 피할 것: 동적 클래스
className={`bg-${color}-500`}

// 대신: 전체 클래스명 사용
className={color === 'coral' ? 'bg-coral-500' : 'bg-mint-500'}
```

### 반응형이 작동하지 않음

1. 모바일 먼저 클래스 작성
2. `sm:`, `lg:` 등 브레이크포인트 접두사 확인

```tsx
// 좋음
<div className="px-4 sm:px-6 lg:px-8">

// 나쁨
<div className="sm:px-6 px-4">
```

### 애니메이션이 끊어짐

1. `animate-` 클래스 확인
2. 프리페어 모션 설정 확인
3. 성능 최적화 (불필요한 렌더링 제거)

---

## 지원 및 기여

디자인 시스템 개선 사항이나 버그는 다음을 통해 보고해주세요:

- GitHub Issues
- 팀 Slack
- Code Review

---

**마지막 업데이트:** 2025년 2월

**작성:** UI/UX 전문가
