import { GameAssetImage } from './GameAssetImage';

interface ChampionImageProps {
  championId: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * ChampionImage Component - 챔피언 아이콘
 * 반응형 크기 지원, 에러 처리 포함
 */
export default function ChampionImage({
  championId,
  size = 'md',
  className = ''
}: ChampionImageProps) {
  return (
    <GameAssetImage
      type="champion"
      id={championId}
      size={size}
      className={className}
      alt={championId ? `챔피언 ${championId}` : undefined}
    />
  );
}
