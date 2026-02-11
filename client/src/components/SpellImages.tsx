'use client';

import { getSpellName } from '@/hooks/lol';

interface SpellImagesProps {
  spellIds: number[];
}

export default function SpellImages({ spellIds }: SpellImagesProps) {
  return (
    <div className="overflow-hidden h-full flex flex-col gap-1">
      {spellIds.map((spell, i) => {
        const fileName = getSpellName(spell);
        return (
          <img
            key={`${spell}-${i}`}
            // className="object-contain h-1/2"
            className="w-6 h-6"
            src={`https://raw.communitydragon.org/latest/game/data/spells/icons2d/${fileName}.png`}
            alt={`spell-${spell}`}
          />
        );
      })}
    </div>
  );
}
