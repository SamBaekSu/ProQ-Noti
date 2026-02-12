'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ChampionImageProps {
  championId: number | null;
}

export default function ChampionImage({ championId }: ChampionImageProps) {
  const [error, setError] = useState(false);

  if (!championId || error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded">
        <span className="text-xs text-gray-500">?</span>
      </div>
    );
  }

  return (
    <Image
      className="object-contain h-full w-auto"
      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`}
      alt={`챔피언 ${championId}`}
      width={64}
      height={64}
      unoptimized
      onError={() => setError(true)}
    />
  );
}
