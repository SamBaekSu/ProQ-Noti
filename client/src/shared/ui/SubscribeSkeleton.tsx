/**
 * 선수 목록 로딩 스켈레톤 UI
 * 실제 IngameBox 컴포넌트와 동일한 디자인 시스템 적용
 */
export default function SubscribeListSkeleton() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full h-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-[0.875rem]"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {/* 메인 카드 - 실제 IngameBox와 동일한 스타일 */}
          <div className="relative overflow-hidden flex items-center justify-center px-7 py-3 gap-5 w-[20.69rem] web:w-[30rem] h-[3.437rem] rounded-[10px] shadow-bottom bg-primary-white">
            {/* Shimmer 애니메이션 오버레이 */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            {/* 왼쪽: 선수 이름 영역 */}
            <div className="w-[13.75rem] space-y-1.5">
              <div className="h-5 bg-gray-200/80 rounded-md animate-pulse" />
              <div className="h-3 w-3/4 bg-gray-100/80 rounded-md animate-pulse" />
            </div>

            {/* 중앙: 라이브 상태 아이콘 영역 */}
            <div className="w-[2.187rem] h-[2.187rem] bg-gray-200/60 rounded-full animate-pulse" />

            {/* 오른쪽: 구독 버튼 영역 */}
            <div className="w-5 h-5 bg-gray-200/60 rounded-sm animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
