'use client';

import { useState, MouseEvent, useEffect, useRef } from 'react';
import { FaRegHeart, FaHeart, FaHourglassStart } from 'react-icons/fa';
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
import SpellImages from './SpellImages';
import RuneImages from './RuneImages';
import { gameModeMap } from '@/shared/hooks/lol';
import { cn } from '@/shared/lib/utils';
import { BUTTON_PADDING, FOCUS_RING } from '@/shared/lib/component-utils';
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
  const [liveGame, setLiveGame] = useState<LiveGameData<
    StreamerModePlayerFields,
    StreamerModeGameFields
  > | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const { toast } = useToast();
  const userId = useUserId();

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
      // 스트리머모드일 경우 최신 전적 보여주기
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
            description: '전적 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.'
          });
          setLiveGame(null);
          setHasFetched(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // 기본 실시간 게임
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
            description: '게임 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.'
          });
          setLiveGame(null);
          setHasFetched(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [puuid, isOpen, hasFetched]);

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
      ? [player.summoner1Id, player.summoner2Id] // 전적 데이터일 때
      : [player.spell1Id, player.spell2Id] // 실시간 게임 데이터일 때
    : [];

  const runePaths = player?.perks
    ? streamer_mode
      ? [
        player.perks.styles[0].style, // 핵심 룬 스타일 (8000, 8100 등)
        player.perks.styles[1].style // 보조 룬 스타일
      ]
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
    <div className="flex flex-col gap-2 w-full max-w-3xl">
      {/* Main Card - Player Info (Riot/OP.GG Style) */}
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
          'group relative overflow-hidden',
          'w-full',
          'px-4 py-3',
          'md:px-5 md:py-4',
          'lg:px-6 lg:py-4',
          'bg-dark-card',
          'border-2',
          isOpen ? 'border-coral' : 'border-dark-border',
          'hover:border-coral/60',
          'transition-all duration-200',
          'cursor-pointer',
          'flex items-center justify-between gap-3',
          // Gaming glow effect on hover
          'hover:shadow-[0_0_20px_rgba(233,95,92,0.3)]',
          isOpen && 'shadow-[0_0_25px_rgba(233,95,92,0.4)]'
        )}
        aria-label={`${pro_name} 게임 정보 확인`}
        aria-expanded={isOpen}
      >
        {/* Animated gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Live indicator - Neon glow */}
        {is_online && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-coral via-yellow to-coral">
            <div className="absolute inset-0 bg-gradient-to-b from-coral via-yellow to-coral blur-sm" />
          </div>
        )}

        {/* Left: Player Info */}
        <div className="flex-1 flex items-center gap-3 md:gap-4 min-w-0 pl-2 relative z-10">
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base md:text-lg font-black text-white uppercase tracking-wide truncate">
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

        {/* Right: Subscribe Button - Gaming style */}
        <button
          className={cn(
            'relative flex-shrink-0 z-10',
            'p-2.5 md:p-3',
            'border-2',
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
            <FaHeart
              className="w-5 h-5 md:w-6 md:h-6"
              aria-hidden="true"
            />
          ) : (
            <FaRegHeart
              className="w-5 h-5 md:w-6 md:h-6"
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* Details Card - Expanded Content (Gaming Style) */}
      {isOpen && (
        <div
          className={cn(
            'w-full',
            'px-5 py-5',
            'md:px-6 md:py-6',
            'lg:px-8 lg:py-7',
            'bg-dark-surface',
            'border-2 border-dark-border',
            'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
            'animate-slideindown',
            'flex flex-col',
            'relative overflow-hidden'
          )}
        >
          {/* Diagonal accent lines - gaming aesthetic */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-coral/10 to-transparent blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-mint/10 to-transparent blur-2xl" />
          {loading ? (
            // Loading State - Gaming HUD style
            <div className="relative flex flex-col items-center justify-center py-12 gap-4 z-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-mint/30 rounded-sm rotate-45" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-t-mint border-r-transparent border-b-transparent border-l-transparent rounded-sm rotate-45 animate-spin" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-gray-300 font-bold uppercase tracking-wider">Loading Game Data</span>
                <div className="w-32 h-1 bg-dark-hover rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-mint to-coral animate-pulse" />
                </div>
              </div>
            </div>
          ) : liveGame && isArenaMode(liveGame) ? (
            // Arena Mode - Gaming style
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
                  {Math.floor((Date.now() - liveGame.gameStartTime) / 60000)}분 전 시작
                </span>
              </div>
            </div>
          ) : player ? (
            // Regular Game Mode - Gaming HUD style
            <div className="relative flex flex-col gap-5 md:gap-6 z-10">
              {/* Game Assets with neon glow */}
              <div className="flex gap-4 md:gap-5 items-center justify-center">
                <div className="flex-shrink-0 relative group">
                  <div className="absolute inset-0 bg-coral/20 blur-xl group-hover:blur-2xl transition-all" />
                  <ChampionImage championId={championId} size="lg" />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow to-amber-500 border-2 border-dark-card shadow-lg flex items-center justify-center">
                    <span className="text-xs font-black text-dark-bg">★</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SpellImages spellIds={spellIds} size="md" />
                  <RuneImages runePaths={runePaths} size="md" />
                </div>
              </div>

              {/* Player Stats - Gaming style */}
              <div className="flex flex-col gap-3 text-center">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-base md:text-lg font-black text-white uppercase tracking-wide">
                    {summoner_name}
                  </span>
                  {tag_line && (
                    <span className="text-sm md:text-base text-gray-400 font-bold">
                      #{tag_line}
                    </span>
                  )}
                </div>

                {streamer_mode && (
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className={cn(
                        'px-5 py-2.5 font-black text-base uppercase tracking-wider border-2',
                        player.win
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                          : 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      )}
                    >
                      {player.win ? 'Victory' : 'Defeat'}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl md:text-2xl font-black text-white">
                        {player.kills}<span className="text-gray-500">/</span>
                        {player.deaths}<span className="text-gray-500">/</span>
                        {player.assists}
                      </span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">
                        KDA {getKdaRatio(player.kills, player.deaths, player.assists)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Game Info Footer - HUD style */}
              <div className="flex flex-col sm:flex-row gap-3 text-sm justify-center items-center pt-4 border-t-2 border-dark-border">
                <div className="flex gap-2 items-center px-4 py-2 bg-dark-hover border border-dark-border">
                  <FaHourglassStart className="w-4 h-4 flex-shrink-0 text-coral" />
                  <span className="font-bold text-gray-300">
                    {streamer_mode
                      ? `${Math.max(0, Math.floor((Date.now() - liveGame!.gameEndTimestamp) / 60000))}분 전 종료`
                      : `${Math.max(0, Math.floor((Date.now() - liveGame!.gameStartTime) / 60000))}분 전 시작`}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-dark-border" />
                <span className="px-4 py-2 bg-mint/20 text-mint border-2 border-mint/50 font-black uppercase tracking-wide shadow-[0_0_10px_rgba(121,206,184,0.3)]">
                  {gameModeMap[(liveGame?.gameMode as keyof typeof gameModeMap) || '']}
                </span>
              </div>
            </div>
          ) : (
            // No Game State - Gaming style
            <div className="relative flex flex-col items-center justify-center py-12 gap-4 z-10">
              <div className="w-20 h-20 border-4 border-dark-border bg-dark-hover flex items-center justify-center relative">
                <FaHourglassStart className="w-8 h-8 text-gray-600" />
                <div className="absolute inset-0 border-4 border-t-gray-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
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
