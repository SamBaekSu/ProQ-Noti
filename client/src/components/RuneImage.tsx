'use client'

interface RuneImagesProps {
  runePaths: string[]
}

export default function RuneImages({ runePaths }: RuneImagesProps) {
  return (
    <div className="overflow-hidden h-full flex flex-col gap-1">
      {runePaths.map((path, i) => (
        <img
          key={i}
          className="object-contain h-1/2"
          src={`https://ddragon.leagueoflegends.com/cdn/img/${path}`}
          alt={`rune-${i}`}
        />
      ))}
    </div>
  )
}