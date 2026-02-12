'use client';

import { useState, MouseEvent, useEffect } from 'react';
import LiveIcon from '@/app/assets/icons/live.svg';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { FaHourglassStart } from 'react-icons/fa';
import { GiSwordClash } from 'react-icons/gi';
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

const FETCH_INTERVAL = 3000;

const ARENA_GAME_MODES = ['CHERRY'];
const ARENA_QUEUE_IDS = [1700, 1710]; // 아레나 큐

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
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveGame, setLiveGame] = useState<LiveGameData<
    StreamerModePlayerFields,
    StreamerModeGameFields
  > | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const { toast } = useToast();
  const userId = useUserId();

  useEffect(() => {
    if (!puuid || !isOpen || hasFetched) return;

    const now = Date.now();
    if (now - lastFetchTime < FETCH_INTERVAL) {
      setHasFetched(true);
      return;
    }
    setLastFetchTime(now);
    if (isOpen && puuid) setLoading(true);

    if (streamer_mode) {
      // 스트리머모드일 경우 최신 전적 보여주기
      fetch(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${last_match_id}?api_key=${RIOT_API_KEY}`,
        { cache: 'no-store' }
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.info) {
            setLiveGame(json.info);
          } else {
            setLiveGame(null);
          }
          setHasFetched(true);
        })
        .catch((error) => {
          setLiveGame(null);
          setHasFetched(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // 기본 실시간 게임
      fetch(`/api/live-game?summonerId=${puuid}`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((json) => {
          if (json.inGame) {
            setLiveGame(json.game);
          } else {
            setLiveGame(null);
          }
          setHasFetched(true);
        })
        .catch((error) => {
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

    if (loggedIn) {
      const permission = Notification.permission;
      if ('Notification' in window && permission !== 'granted') {
        Notification.requestPermission();
      }

      if (permission === 'denied') {
        toast({
          description: '알림 권한을 허용해주세요!'
        });
        return;
      }

      // Call server action to toggle subscription
      const result = await toggleSubscription(userId!, Number(id));

      setIsSubscribe(!isSubscribe);
    } else {
      toast({ description: '로그인 후 구독 버튼을 눌러주세요!' });
    }
  };

  return (
    <div className="flex flex-col gap-[0.875rem]">
      <div
        className="flex items-center justify-center px-7 py-3 gap-5 w-[20.69rem] web:w-[30rem] h-[3.437rem] rounded-[10px] shadow-bottom bg-primary-white cursor-pointer"
        onClick={onBoxClick}
      >
        <div className="w-[13.75rem] font-semibold">{pro_name}</div>
        {is_online ? (
          <div className="animate-pulse">
            <LiveIcon />
          </div>
        ) : (
          <div className="w-[2.187rem]"></div>
        )}
        <button className="flex" onClick={handleSubscribeClick}>
          {isSubscribe ? (
            <FaHeart size={20} className="text-primary-coral animate-like" />
          ) : (
            <FaRegHeart size={20} />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-1 items-center justify-center px-7 py-3 w-[20.69rem] web:w-[30rem] h-[9.25rem] rounded-[10px] shadow-bottom bg-primary-white animate-slideindown">
          {loading ? (
            // 1. 로딩 중일 때는 스피너를 표시
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-mint"></div>
          ) : liveGame && isArenaMode(liveGame) ? (
            // 2. 아레나 모드일 때 특별 표시
            <div className="flex flex-col items-center justify-center gap-2 h-full">
              <div className="flex items-center gap-2">
                <GiSwordClash size={24} className="text-yellow-500" />
                <span className="text-xl font-bold text-yellow-600">
                  아레나 모드 중
                </span>
                <GiSwordClash size={24} className="text-yellow-500" />
              </div>
              <div className="text-body2Bold">
                {summoner_name}
                {tag_line && `#${tag_line}`}
              </div>
              <div className="flex gap-1 items-center text-body2">
                <FaHourglassStart className="text-primary-mint" />
                <div>
                  {Math.floor((Date.now() - liveGame.gameStartTime) / 60000)}분
                  전 시작
                </div>
              </div>
            </div>
          ) : player ? (
            // 3. 일반 게임 모드일 때 기존 정보 표시
            <>
              <div className="flex gap-2 w-full h-full overflow-hidden items-center justify-center">
                <ChampionImage championId={championId} />
                <div className="flex items-center gap-0.5">
                  <SpellImages spellIds={spellIds} />
                  <RuneImages runePaths={runePaths} />
                </div>
              </div>
              <div className="text-body2Bold flex gap-2">
                {summoner_name}
                {tag_line && `#${tag_line}`}
                {streamer_mode && (
                  <div
                    className={player.win ? 'text-blue-500' : 'text-red-500'}
                  >
                    {player.win ? '승' : '패'}
                  </div>
                )}
              </div>
              {streamer_mode && (
                <div className="text-body2Bold flex gap-0.5 leading-none -mt-0.5 text-gray-700">
                  <span>
                    {player.kills}/{player.deaths}/{player.assists}
                  </span>
                  <span>
                    ({getKdaRatio(player.kills, player.deaths, player.assists)})
                  </span>
                </div>
              )}
              <div className="flex justify-between w-full text-body2">
                <div className="flex gap-1 items-center">
                  <FaHourglassStart className="text-primary-mint" />
                  {liveGame && (
                    <div>
                      {streamer_mode
                        ? `${Math.floor((Date.now() - liveGame.gameEndTimestamp) / 60000)}분 전 종료`
                        : `${Math.floor((Date.now() - liveGame.gameStartTime) / 60000)}분 전 시작`}
                    </div>
                  )}
                </div>
                <div>
                  {`큐 타입: ${gameModeMap[(liveGame?.gameMode as keyof typeof gameModeMap) || '']}`}
                </div>
              </div>
            </>
          ) : (
            // 4. 로딩이 끝났는데, player 데이터가 없으면 '게임 중 아님' 메시지를 표시
            <span className="text-xl">현재 게임중이 아닙니다.</span>
          )}
        </div>
      )}
    </div>
  );
}
