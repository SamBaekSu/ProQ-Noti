'use client';

import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '@/utils/hooks/useOutsideClick';
import IngameBox from '@/components/IngameBox';
import { gammerInfo, ISubscribeItem } from '@/types';
import { useSelector } from 'react-redux';
import { isLoggedIn } from '@/store/authSlice';

export default function SubscribeList({ list }: { list: gammerInfo[] }) {
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

  const gammerList: ISubscribeItem[] = list.map((item) => ({
    ...item,
    isLive: true,
    isSubscribe: true
  }));

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-5 items-center justify-center w-full h-full"
    >
      {gammerList.map((item, index) => (
        <IngameBox
          key={index}
          pro_name={item.pro_name}
          isLive={item.isLive}
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
