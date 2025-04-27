'use client'

interface RuneImagesProps {
  runePaths: string[];
}

export default function RuneImages({ runePaths }: RuneImagesProps) {

  console.log("룬", runePaths);
  return (
    <div className="overflow-hidden h-full flex flex-col gap-1">
      {runePaths.map((path, i) => (
        <img
          key={i}
          className="object-contain h-1/2"
          src={`https://ddragon.leagueoflegends.com/${path}`}
          alt={`rune-${i}`}
        />
      ))}
    </div>
  )
}