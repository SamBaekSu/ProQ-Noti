'use client'

interface ChampionImageProps {
  championName: string
  version: string
}

export default function ChampionImage({ championName, version }: ChampionImageProps) {
  return (
    <img
      className="h-full object-contain"
      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`}
      alt={championName}
    />
  )
}