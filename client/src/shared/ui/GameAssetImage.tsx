'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { getSpellName, getRunePath } from '@/shared/hooks/lol';

type AssetType = 'champion' | 'spell' | 'rune';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface GameAssetImageProps {
  type: AssetType;
  id: number | null;
  size?: Size;
  className?: string;
  alt?: string;
}

const SIZE_MAP: Record<Size, { size: number; className: string }> = {
  xs: { size: 20, className: 'w-5 h-5' },
  sm: { size: 48, className: 'w-12 h-12' },
  md: { size: 64, className: 'w-16 h-16' },
  lg: { size: 96, className: 'w-24 h-24' }
};

/**
 * Generates the URL for a game asset based on type and ID
 */
function getAssetUrl(type: AssetType, id: number): string {
  switch (type) {
    case 'champion':
      return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${id}.png`;
    case 'spell': {
      const fileName = getSpellName(id);
      return `https://raw.communitydragon.org/latest/game/data/spells/icons2d/${fileName}.png`;
    }
    case 'rune': {
      const runePath = getRunePath(id);
      return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/${runePath.toLowerCase()}.png`;
    }
    default:
      return '';
  }
}

/**
 * GameAssetImage Component - Unified image component for game assets
 * Handles champions, spells, and runes with consistent error handling and styling
 */
export function GameAssetImage({
  type,
  id,
  size = 'md',
  className = '',
  alt
}: GameAssetImageProps) {
  const [error, setError] = useState(false);
  const { size: pixelSize, className: sizeClassName } = SIZE_MAP[size];

  if (!id || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-200',
          type === 'champion' ? 'rounded-lg' : 'rounded',
          sizeClassName,
          className
        )}
        role="presentation"
        aria-label={error ? `${type} 이미지 로드 실패` : undefined}
      >
        <span className="text-xs text-gray-500 font-semibold">?</span>
      </div>
    );
  }

  return (
    <div className={cn('relative flex-shrink-0', sizeClassName, className)}>
      <Image
        src={getAssetUrl(type, id)}
        alt={alt || `${type} ${id}`}
        width={pixelSize}
        height={pixelSize}
        unoptimized
        onError={() => setError(true)}
        className={cn(
          'object-contain w-full h-full',
          type === 'champion' ? 'rounded-lg' : 'rounded'
        )}
        loading="lazy"
      />
    </div>
  );
}
