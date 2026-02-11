'use client';

import { LiveGameData } from '@/types';
import { useEffect, useState } from 'react';

export function useLiveGameBySummonerId(summonerId: string) {
  const [data, setData] = useState<LiveGameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!summonerId) return;

    setLoading(true);
    fetch(`/api/live-game-by-summoner?summonerId=${summonerId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.inGame) {
          setData(json.game);
        } else {
          setData(null);
        }
      })
      .catch(() => setError('실시간 게임 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [summonerId]);

  return { data, loading, error };
}
