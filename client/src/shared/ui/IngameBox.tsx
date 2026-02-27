'use client';

import { useState, MouseEvent, useEffect, useRef } from 'react';
import {
  FaRegHeart,
  FaHeart,
  FaHourglassStart,
  FaPowerOff
} from 'react-icons/fa';
import { GiSwordClash } from 'react-icons/gi';
import { LiveIcon } from './LiveIcon';
import type {
  IIngameBoxProps,
  LiveGameData,
  LiveGameParticipant,
  StreamerModeGameFields,
  StreamerModePlayerFields
} from '@/shared/types';
import { useToast } from '@/shared/hooks/useToast';
import { useUserId } from '@/shared/hooks/useAuth';
import { toggleSubscription } from '@/actions/subscribe';
import ChampionImage from './ChampionImage';
import { GameAssetImage } from './GameAssetImage';
import { gameModeMap } from '@/shared/hooks/lol';
import { cn } from '@/shared/lib/utils';
import { announceStateChange } from '@/shared/lib/a11y';

const FETCH_INTERVAL = 3000;
const ARENA_GAME_MODES = ['CHERRY'];
const ARENA_QUEUE_IDS = [1700, 1710];
const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

export default function IngameBox({
  pro_name,
  summoner_name,
  tag_line,
  is_online,
  is_subscribed: initialIsSubscribe,
  isOpen,
  onBoxClick,
  loggedIn,
  puuid,
  id,
  streamer_mode,
  last_match_id
}: IIngameBoxProps) {
  const [isSubscribe, setIsSubscribe] = useState<boolean>(
    initialIsSubscribe ?? false
  );
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loadingProgress, setLoadingProgress] = useState(10);
  console.log(summoner_name);

  const [liveGame, setLiveGame] = useState<LiveGameData<
    StreamerModePlayerFields,
    StreamerModeGameFields
  > | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const { toast } = useToast();
  const userId = useUserId();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      setLoadingProgress(10);
      timer = setTimeout(() => {
        setLoadingProgress(100);
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!puuid || !isOpen || hasFetched) return;

    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;

    if (timeSinceLastFetch < FETCH_INTERVAL) {
      const timeoutId = setTimeout(() => {
        setHasFetched(false);
      }, FETCH_INTERVAL - timeSinceLastFetch);

      return () => clearTimeout(timeoutId);
    }

    lastFetchTimeRef.current = now;
    setLoading(true);

    if (streamer_mode) {
      fetch(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${last_match_id}?api_key=${RIOT_API_KEY}`,
        { cache: 'no-store' }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error('전적 정보를 불러올 수 없습니다');
          }
          return res.json();
        })
        .then((json) => {
          if (json.info) {
            setLiveGame(json.info);
          } else {
            setLiveGame(null);
          }
          setHasFetched(true);
        })
        .catch((error) => {
          toast({
            description:
              '전적 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.'
          });
          setLiveGame(null);
          setHasFetched(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      fetch(`/api/live-game?summonerId=${puuid}`, { cache: 'no-store' })
        .then((res) => {
          if (!res.ok) {
            throw new Error('게임 정보를 불러올 수 없습니다');
          }
          return res.json();
        })
        .then((json) => {
          if (json.inGame) {
            setLiveGame(json.game);
          } else {
            setLiveGame(null);
          }
          setHasFetched(true);
        })
        .catch((error) => {
          toast({
            description:
              '게임 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.'
          });
          setLiveGame(null);
          setHasFetched(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [puuid, isOpen, hasFetched, streamer_mode, last_match_id, toast]);

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setHasFetched(false);
    }
  }, [isOpen]);

  const player = liveGame?.participants.find(
    (p: LiveGameParticipant) => p.puuid === puuid
  );
  const championId = player ? player.championId : null;
  const spellIds = player
    ? streamer_mode
      ? [player.summoner1Id, player.summoner2Id]
      : [player.spell1Id, player.spell2Id]
    : [];

  const runePaths = player?.perks
    ? streamer_mode
      ? [player.perks.styles[0].style, player.perks.styles[1].style]
      : [player.perks.perkStyle, player.perks.perkSubStyle]
    : [];

  const getKdaRatio = (kills: number, deaths: number, assists: number) => {
    const safeDeaths = deaths === 0 ? 1 : deaths;
    const ratio = (kills + assists) / safeDeaths;

    return ratio.toFixed(2);
  };

  const isArenaMode = (game: LiveGameData | null): boolean => {
    if (!game) return false;

    return (
      ARENA_GAME_MODES.includes(game.gameMode) ||
      ARENA_QUEUE_IDS.includes(game.gameQueueConfigId)
    );
  };

  const handleSubscribeClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isSubscribing) return;

    if (!loggedIn) {
      toast({ description: '로그인 후 구독 버튼을 눌러주세요!' });
      return;
    }

    const permission = Notification.permission;
    if ('Notification' in window && permission !== 'granted') {
      await Notification.requestPermission();
    }

    if (permission === 'denied') {
      toast({
        description: '알림 권한을 허용해주세요!'
      });
      return;
    }

    setIsSubscribing(true);

    try {
      await toggleSubscription(userId!, Number(id));
      setIsSubscribe(!isSubscribe);
      announceStateChange(!isSubscribe ? '구독했습니다' : '구독 해제했습니다');
      toast({
        description: !isSubscribe ? '구독했습니다!' : '구독 해제했습니다.'
      });
    } catch (error) {
      toast({
        description: '구독 처리에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive'
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Main Card - Player Info */}
      <div
        onClick={onBoxClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBoxClick();
          }
        }}
        role="button"
        tabIndex={0}
        className={cn(
          'group',
          'w-full',
          'px-5 py-3',
          'md:px-6 md:py-4',
          'lg:px-8 lg:py-5',
          'bg-dark-card',
          'border',
          'rounded-lg',
          isOpen ? 'border-coral' : 'border-dark-border',
          'hover:border-coral/60',
          'transition-all duration-200',
          'cursor-pointer',
          'flex items-center justify-between gap-3',
          'hover:shadow-card-hover',
          isOpen && 'shadow-card-hover',
          is_online &&
            'border-l-4 border-l-coral shadow-[inset_4px_0_0_0_rgba(233,95,92,0.3)]',
          'hover:bg-gradient-to-r hover:from-transparent hover:via-coral/5 hover:to-transparent'
        )}
        aria-label={`${pro_name} 게임 정보 확인`}
        aria-expanded={isOpen}
      >
        <div className="flex-1 flex items-center gap-3 md:gap-4 min-w-0">
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base md:text-lg font-black text-white tracking-wide truncate">
                {pro_name}
              </span>
              {is_online && (
                <div className="flex-shrink-0">
                  <LiveIcon className="w-8 h-6 md:w-9 md:h-7 drop-shadow-[0_0_8px_rgba(233,95,92,0.8)]" />
                </div>
              )}
            </div>
            {isOpen && (
              <span className="text-xs md:text-sm text-gray-400 truncate font-medium">
                {summoner_name}
                {tag_line && `#${tag_line}`}
              </span>
            )}
          </div>
        </div>

        <button
          className={cn(
            'relative flex-shrink-0 z-10',
            'p-2.5 md:p-3',
            'border-2',
            'rounded-lg',
            'transition-all duration-200',
            isSubscribing && 'opacity-50 cursor-wait',
            isSubscribe
              ? 'bg-coral/20 border-coral text-coral hover:bg-coral/30 shadow-[0_0_15px_rgba(233,95,92,0.5)]'
              : 'bg-dark-hover border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
          )}
          aria-label={isSubscribe ? '구독 해제' : '구독'}
          aria-pressed={isSubscribe}
          disabled={isSubscribing}
          onClick={handleSubscribeClick}
        >
          {isSubscribing ? (
            <div
              className="w-5 h-5 md:w-6 md:h-6 border-2 border-coral border-t-transparent rounded-full animate-spin"
              aria-label="처리 중"
            />
          ) : isSubscribe ? (
            <FaHeart className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
          ) : (
            <FaRegHeart className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Details Card - Expanded Content */}
      {isOpen && (
        <div
          className={cn(
            'w-full px-6 py-5 md:px-8 md:py-6 lg:px-10 lg:py-7 bg-dark-surface border border-dark-border rounded-lg shadow-card animate-slideindown flex flex-col relative overflow-hidden'
          )}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-coral/10 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-mint/10 to-transparent blur-2xl pointer-events-none" />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 z-10">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-gray-300 font-bold uppercase tracking-wider">
                  Loading Game Data
                </span>
                <div className="w-32 h-1 bg-dark-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-mint to-coral transition-all duration-[3000ms] ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : liveGame && isArenaMode(liveGame) ? (
            <div className="relative flex flex-col items-center justify-center gap-4 py-6 z-10">
              <div className="relative flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow/20 to-amber-500/20 border-2 border-yellow shadow-[0_0_20px_rgba(255,219,0,0.3)]">
                <GiSwordClash className="w-6 h-6 text-yellow drop-shadow-[0_0_8px_rgba(255,219,0,0.8)] animate-pulse" />
                <span className="text-lg md:text-xl font-black text-yellow uppercase tracking-wide">
                  Arena Mode
                </span>
                <GiSwordClash className="w-6 h-6 text-yellow drop-shadow-[0_0_8px_rgba(255,219,0,0.8)] animate-pulse" />
              </div>
              <div className="text-sm md:text-base font-bold text-gray-300 text-center">
                {summoner_name}
                {tag_line && `#${tag_line}`}
              </div>
              <div className="flex gap-2 items-center px-4 py-2 bg-dark-hover border border-dark-border">
                <FaHourglassStart className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-300 font-semibold">
                  {Math.floor((Date.now() - liveGame.gameStartTime) / 60000)}분
                  전 시작
                </span>
              </div>
            </div>
          ) : player ? (
            <div className="relative flex flex-col gap-4 md:gap-5 z-10 px-2 md:px-4 w-full overflow-visible">
              {/* [챔피언/스펠] -> [KDA] -> [승패] 순서대로 배치 (데스크탑은 원본유지) */}
              <div className="flex items-center gap-2 md:gap-4 w-full min-w-0">
                {/* 1. 챔피언 이미지 */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-16 h-16 md:w-[64px] md:h-[64px] [&>*]:w-full [&>*]:h-full overflow-hidden rounded-lg md:rounded-[0.5rem]">
                    <ChampionImage championId={championId} size="lg" />
                  </div>
                  {/* Level Badge */}
                  <div className="min-w-[28px] h-5 md:h-6 px-1.5 bg-dark-bg/90 border-2 border-dark-border rounded flex items-center justify-center">
                    <span className="text-[10px] md:text-xs font-black text-white">
                      Lv.
                      {(player as any).champLevel || player.championLevel || 1}
                    </span>
                  </div>
                </div>

                {/* 2. 룬/스펠 */}
                <div className="grid grid-cols-2 gap-1 md:gap-1.5 flex-shrink-0">
                  {spellIds[0] && (
                    <div className="w-8 h-8 md:w-[32px] md:h-[32px] [&>*]:w-full [&>*]:h-full rounded">
                      <GameAssetImage
                        type="spell"
                        id={spellIds[0]}
                        size="md"
                        alt="스펠 1"
                      />
                    </div>
                  )}
                  {runePaths[0] && (
                    <div className="w-8 h-8 md:w-[32px] md:h-[32px] [&>*]:w-full [&>*]:h-full rounded-full overflow-hidden">
                      <GameAssetImage
                        type="rune"
                        id={runePaths[0]}
                        size="md"
                        alt="메인 룬"
                      />
                    </div>
                  )}
                  {spellIds[1] && (
                    <div className="w-8 h-8 md:w-[32px] md:h-[32px] [&>*]:w-full [&>*]:h-full rounded">
                      <GameAssetImage
                        type="spell"
                        id={spellIds[1]}
                        size="md"
                        alt="스펠 2"
                      />
                    </div>
                  )}
                  {runePaths[1] && (
                    <div className="w-8 h-8 md:w-[32px] md:h-[32px] [&>*]:w-full [&>*]:h-full rounded-full overflow-hidden">
                      <GameAssetImage
                        type="rune"
                        id={runePaths[1]}
                        size="md"
                        alt="보조 룬"
                      />
                    </div>
                  )}
                </div>

                {/* 3. KDA Stats */}
                {streamer_mode ? (
                  <div className="flex flex-col gap-1 flex-1 min-w-0 items-center pr-1 md:pr-0">
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="text-base md:text-xl font-black text-white whitespace-nowrap">
                        {player.kills}
                        <span className="text-gray-500 mx-0.5">/</span>
                        <span className="text-red-400">{player.deaths}</span>
                        <span className="text-gray-500 mx-0.5">/</span>
                        {player.assists}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-400 font-bold whitespace-nowrap">
                      {getKdaRatio(player.kills, player.deaths, player.assists)}
                      :1 KDA
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 flex-1 min-w-0 items-end md:items-start pr-1 md:pr-0">
                    <span className="text-sm md:text-base font-bold text-white truncate max-w-[150px] sm:max-w-none">
                      {summoner_name}
                    </span>
                    {tag_line && (
                      <span className="text-[10px] md:text-xs text-gray-400 font-medium truncate">
                        #{tag_line}
                      </span>
                    )}
                  </div>
                )}

                {/* 4. 승패 배지 */}
                {streamer_mode && (
                  <div
                    className={cn(
                      'flex items-center justify-center font-black uppercase tracking-wide border-2 flex-shrink-0',
                      'w-8 h-8 text-sm rounded-lg md:w-auto md:h-auto md:px-4 md:py-2 md:rounded',
                      player.win
                        ? 'bg-opgg-blue/20 border-opgg-blue text-opgg-blue'
                        : 'bg-red-500/20 border-red-500 text-red-400'
                    )}
                  >
                    {player.win ? 'W' : 'L'}
                  </div>
                )}
              </div>

              {/* Game Info Footer (모바일 최적화 배치) */}
              <div className="flex flex-row flex-wrap gap-2 sm:gap-3 text-sm justify-center items-center pt-4 border-t-2 border-dark-border">
                <div className="flex gap-2 items-center px-4 py-2 bg-dark-hover border border-dark-border rounded-md">
                  <FaHourglassStart className="w-4 h-4 flex-shrink-0 text-coral" />
                  <span className="font-bold text-gray-300">
                    {streamer_mode
                      ? `${Math.max(0, Math.floor((Date.now() - liveGame!.gameEndTimestamp) / 60000))}분 전 종료`
                      : `${Math.max(0, Math.floor((Date.now() - liveGame!.gameStartTime) / 60000))}분 전 시작`}
                  </span>
                </div>

                <span className="px-4 py-2 bg-mint/20 text-mint border-2 border-mint/50 font-black uppercase tracking-wide rounded-md shadow-[0_0_10px_rgba(121,206,184,0.3)]">
                  {
                    gameModeMap[
                      (liveGame?.gameMode as keyof typeof gameModeMap) || ''
                    ]
                  }
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4 z-10">
              <div className="w-20 h-20 border-4 border-t-gray-600 bg-dark-hover flex items-center justify-center rounded-full">
                <FaPowerOff className="w-8 h-8 text-gray-600" />
              </div>
              <span className="text-base md:text-lg font-black text-gray-400 uppercase tracking-wide">
                Offline
              </span>
              <span className="text-sm text-gray-500 font-medium">
                게임이 시작되면 알려드릴게요
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
