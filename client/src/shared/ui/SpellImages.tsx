'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getSpellName } from '@/shared/hooks/lol';

interface SpellImagesProps {
  spellIds: number[];
}

function SpellImage({ spellId }: { spellId: number }) {
  const [error, setError] = useState(false);
  const fileName = getSpellName(spellId);

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
      src={`https://raw.communitydragon.org/latest/game/data/spells/icons2d/${fileName}.png`}
      alt={`스펠 ${fileName}`}
      width={24}
      height={24}
      unoptimized
      onError={() => setError(true)}
    />
  );
}

export default function SpellImages({ spellIds }: SpellImagesProps) {
  return (
    <div className="overflow-hidden h-full flex flex-col gap-1">
      {spellIds.map((spell, i) => (
        <SpellImage key={`${spell}-${i}`} spellId={spell} />
      ))}
    </div>
  );
}
