import { GameAssetImage } from './GameAssetImage';

interface SpellImagesProps {
  spellIds: number[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * SpellImages Component - 스펠 목록
 * 반응형 레이아웃
 */
export default function SpellImages({
  spellIds,
  size = 'xs'
}: SpellImagesProps) {
  return (
    <div className="flex flex-col gap-1 overflow-hidden">
      {spellIds.map((spell, i) => (
        <GameAssetImage
          key={`spell-${spell}-${i}`}
          type="spell"
          id={spell}
          size={size}
          alt={`스펠 ${i + 1}`}
        />
      ))}
    </div>
  );
}
