import { GameAssetImage } from './GameAssetImage';

interface RuneImagesProps {
  runePaths: number[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * RuneImages Component - 룬 목록
 * 반응형 레이아웃
 */
export default function RuneImages({
  runePaths,
  size = 'xs'
}: RuneImagesProps) {
  return (
    <div className="flex flex-col gap-1 overflow-hidden">
      {runePaths.map((perkId, i) => (
        <GameAssetImage
          key={`rune-${perkId}-${i}`}
          type="rune"
          id={perkId}
          size={size}
          alt={`룬 ${i + 1}`}
        />
      ))}
    </div>
  );
}
