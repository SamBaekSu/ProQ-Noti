'use client';

import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import IngameBox from '@/shared/ui/IngameBox';
import { IProPlayerData } from '@/shared/types';
import { useIsLoggedIn } from '@/shared/hooks/useAuth';

interface SubscribeListProps {
  list: IProPlayerData[];
  onUnsubscribe?: (proId: number) => void;
  emptyState?: React.ReactNode;
}

/**
 * SubscribeList Component - 선수 목록
 * 반응형 레이아웃, 터치/마우스 모두 지원
 */
export default function SubscribeList({
  list,
  onUnsubscribe,
  emptyState
}: SubscribeListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loggedIn = useIsLoggedIn();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBoxClick = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSetOpenIndex = () => {
    setOpenIndex(null);
  };

  useOutsideClick(
    containerRef as React.RefObject<HTMLElement>,
    handleSetOpenIndex
  );

  if (!mounted) return null;

  if (list.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px] py-12">
        {emptyState || (
          <div className="flex flex-col items-center gap-5 text-center px-6">
            <div className="relative w-24 h-24 md:w-28 md:h-28">
              <div className="absolute inset-0 bg-dark-card border-4 border-dark-border flex items-center justify-center">
                <svg
                  className="w-12 h-12 md:w-14 md:h-14 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-coral" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-coral" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-coral" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-coral" />
            </div>
            <div className="space-y-2">
              <p className="text-lg md:text-xl font-black text-white uppercase tracking-wide">
                No Subscriptions
              </p>
              <p className="text-sm md:text-base text-gray-400 max-w-sm font-medium">
                선수를 구독하면 게임 시작 시 실시간 알림을 받을 수 있습니다
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="
        flex
        flex-col
        gap-3 md:gap-4
        items-center
        justify-start
        w-full
        px-4 md:px-6 lg:px-8
        py-6
        max-w-4xl
        mx-auto
      "
      role="list"
      aria-label="구독한 프로게이머 목록"
    >
      {list.map((item, index) => (
        <div
          key={item.id}
          role="listitem"
          className="w-full animate-slideindown"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <IngameBox
            pro_name={item.pro_name}
            is_online={item.is_online}
            is_subscribed={item.is_subscribed}
            isOpen={openIndex === index}
            onBoxClick={() => handleBoxClick(index)}
            id={item.id}
            puuid={item.puuid}
            summoner_name={item.summoner_name}
            tag_line={item.tag_line}
            account_id={item.account_id}
            loggedIn={loggedIn}
            streamer_mode={item.streamer_mode}
            last_match_id={item.last_match_id}
          />
        </div>
      ))}
    </div>
  );
}
