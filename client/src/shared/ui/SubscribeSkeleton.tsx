export default function SubscribeListSkeleton() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full h-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-[0.875rem] animate-pulse">
          {/* 상단 박스 */}
          <div className="flex items-center justify-between px-7 py-3 gap-5 w-[20.69rem] web:w-[30rem] h-[3.437rem] rounded-[10px] shadow-bottom bg-gray-200">
            <div className="w-[13.75rem] h-4 bg-gray-300 rounded" />
          </div>

          {/* 하단 펼침 영역 생략 or 대체 박스 넣고 싶다면 아래 주석 해제 */}
          {/* <div className="flex flex-col gap-1 items-center justify-center px-7 py-3 w-[20.69rem] web:w-[30rem] h-[9.25rem] rounded-[10px] shadow-bottom bg-gray-200" /> */}
        </div>
      ))}
    </div>
  );
}
