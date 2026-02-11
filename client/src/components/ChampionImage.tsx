'use client';

interface ChampionImageProps {
  championId: number | null;
}

export default function ChampionImage({ championId }: ChampionImageProps) {
  return (
    <img
      className="object-contain h-full"
      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`}
      alt={`champion-${championId}`}
    />
  );
}
