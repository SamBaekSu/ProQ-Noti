'use client';

import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';
import IngameBox from '@/components/IngameBox';
import { gamerInfo, ISubscribeItem } from '@/types';
import { useSelector } from 'react-redux';
import { isLoggedIn } from '@/store/authSlice';

export default function SubscribeList({ list }: { list: gamerInfo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loggedIn = useSelector(isLoggedIn);
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

  const playerList: ISubscribeItem[] = list.map((item) => ({
    ...item,
    isSubscribe: true
  }));

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-5 items-center justify-center w-full h-full"
    >
      {playerList.map((item, index) => (
        <IngameBox
          key={index}
          pro_name={item.pro_name}
          is_online={item.is_online}
          isSubscribe={item.isSubscribe}
          isOpen={openIndex === index}
          onBoxClick={() => handleBoxClick(index)}
          id={item.id}
          puuid={item.puuid}
          summoner_name={item.summoner_name}
          tag_line={item.tag_line}
          loggedIn={loggedIn}
        />
      ))}
    </div>
  );
}
