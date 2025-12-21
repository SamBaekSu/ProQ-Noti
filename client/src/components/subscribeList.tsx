'use client';

import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';
import IngameBox from '@/components/IngameBox';
import { IProPlayerData } from '@/types';
import { useIsLoggedIn } from '@/hooks/useAuth';

interface SubscribeListProps {
  list: IProPlayerData[];
  onUnsubscribe?: (proId: number) => void;
}

export default function SubscribeList({
  list,
  onUnsubscribe
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

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-5 items-center justify-center w-full h-full"
    >
      {list.map((item, index) => (
        <IngameBox
          key={index}
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
          league={item.league}
          last_match_id={item.last_match_id}
        />
      ))}
    </div>
  );
}
