/**
 * SubscribeListSkeleton Component - 선수 목록 로딩 스켈레톤
 * IngameBox 컴포넌트와 동일한 반응형 디자인
 */
export default function SubscribeListSkeleton() {
  return (
    <div
      className="
        flex flex-col gap-3 sm:gap-4
        items-center justify-start
        w-full h-full
        px-4 sm:px-6 lg:px-8
        py-4 sm:py-6 lg:py-8
      "
      role="status"
      aria-label="로딩 중"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-full flex flex-col gap-3 sm:gap-4"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Main Card Skeleton */}
          <div
            className="
              w-full px-4 sm:px-6 py-2.5 sm:py-3
              rounded-lg sm:rounded-xl
              bg-gray-100
              animate-pulse
            "
          >
            {/* Content placeholder */}
            <div className="flex items-center justify-between gap-4">
              {/* Left section */}
              <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                <div className="h-4 sm:h-5 bg-gray-300 rounded w-2/3" />
                <div className="h-3 sm:h-3.5 bg-gray-300 rounded w-1/2" />
              </div>

              {/* Center - live icon */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded-full flex-shrink-0" />

              {/* Right - heart icon */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded flex-shrink-0" />
            </div>
          </div>

          {/* Details Card Skeleton */}
          <div
            className="
              w-full px-4 sm:px-6 py-4 sm:py-6
              rounded-lg sm:rounded-xl
              bg-gray-100
              animate-pulse
            "
          >
            {/* Content placeholder */}
            <div className="space-y-3">
              {/* Champion + spells/runes */}
              <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-lg flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded" />
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded" />
                </div>
              </div>

              {/* Player info */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>

              {/* Game info */}
              <div className="border-t border-gray-300 pt-3 flex flex-col items-center gap-2">
                <div className="h-3 bg-gray-300 rounded w-2/3" />
                <div className="h-3 bg-gray-300 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
