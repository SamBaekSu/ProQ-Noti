'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getRunePath } from '@/shared/hooks/lol';

interface RuneImagesProps {
  runePaths: number[];
}

function RuneImage({ perkId }: { perkId: number }) {
  const [error, setError] = useState(false);
  const runePath = getRunePath(perkId);

  if (error) {
    return (
      <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded">
        <span className="text-xs text-gray-500">?</span>
      </div>
    );
  }

  return (
    <Image
      className="w-6 h-6 object-contain"
      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/${runePath.toLowerCase()}.png`}
      alt={`룬 ${runePath}`}
      width={24}
      height={24}
      unoptimized
      onError={() => setError(true)}
    />
  );
}

export default function RuneImages({ runePaths }: RuneImagesProps) {
  return (
    <div className="overflow-hidden h-full flex flex-col gap-1">
      {runePaths.map((perkId, i) => (
        <RuneImage key={`rune-${perkId}-${i}`} perkId={perkId} />
      ))}
    </div>
  );
}
