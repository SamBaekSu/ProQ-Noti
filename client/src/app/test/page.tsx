'use client';

import RuneImages from '@/shared/ui/RuneImages';
import SpellImages from '@/shared/ui/SpellImages';

const rankedSpellIds = [
  1, // Cleanse
  3, // Exhaust
  4, // Flash
  6, // Ghost
  7, // Heal
  11, // Smite
  12, // Teleport
  13, // Clarity
  14, // Ignite
  21 // Barrier
];

const keystoneRuneIds = [
  8005, // Press the Attack
  8008, // Lethal Tempo
  8010, // Conqueror
  8021, // Fleet Footwork
  8112, // Electrocute
  8124, // Predator
  8128, // Dark Harvest
  8214, // Summon Aery
  8229, // Arcane Comet
  8230, // Phase Rush
  8301, // Glacial Augment
  8302, // Unsealed Spellbook
  8303, // First Strike
  8437, // Grasp of the Undying
  8401, // Aftershock
  8465 // Guardian
];

const substyleRuneIds = [
  8000, // Precision
  8100, // Domination
  8200, // Sorcery
  8300, // Inspiration
  8400 // Resolve
];

export default function TestPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mt-8">룬 이미지 테스트</h1>
      <div className="flex flex-wrap gap-2">
        <RuneImages runePaths={keystoneRuneIds} />
      </div>

      <h1 className="text-2xl font-bold mt-8">
        🌀 Sub Rune Styles (부룬 스타일)
      </h1>
      <div className="flex flex-wrap gap-2">
        <RuneImages runePaths={substyleRuneIds} />
      </div>
    </div>
  );
}
