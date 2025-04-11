'use client'

interface SpellImagesProps {
  spellNames: string[]
  version: string
}

export default function SpellImages({ spellNames, version }: SpellImagesProps) {
  return (
    <div className="overflow-hidden h-full flex flex-col gap-1">
      {spellNames.map((spell, i) => (
        <img
          key={i}
          className="object-contain h-1/2"
          src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell}.png`}
          alt={spell}
        />
      ))}
    </div>
  )
}
