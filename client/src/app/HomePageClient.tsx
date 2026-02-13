'use client';

import { Layout } from '@/shared/ui/Layout';
import { TeamGrid } from '@/shared/ui/TeamGrid';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useIsLoggedIn, useUserId } from '@/shared/hooks/useAuth';
import { getFirebaseMessaging } from '@/shared/lib/firebase';
import { getToken } from 'firebase/messaging';
import { getDeviceType } from '@/shared/lib/device';
import { upsertFcmToken } from '@/actions/fcm';
import type { Team } from '@/shared/types';

interface LivePlayer {
  id: number;
  pro_name: string;
  team_abbr: string;
  team_name: string;
  summoner_name: string;
  tag_line: string;
  puuid: string;
  is_online: boolean;
}

interface HomePageClientProps {
  initialTeams: Team[];
  initialLivePlayers: LivePlayer[];
}

export default function HomePageClient({ initialTeams, initialLivePlayers }: HomePageClientProps) {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  // We use initialTeams passed from Server Component
  const teams = initialTeams;
  const livePlayers = initialLivePlayers;

  const isLoggedIn = useIsLoggedIn();
  const userId = useUserId();

  const handleSelectTeam = (team: string) => {
    setSelectedTeam(team);
    router.push(`/subscribe/${team}`);
  };

  const validateAndRefreshToken = useCallback(async () => {
    // 1. 로그인 상태가 아니거나, 메시징 기능이 없으면 즉시 중단
    const messaging = getFirebaseMessaging();
    if (!isLoggedIn || !userId || !messaging) {
      return;
    }

    try {
      // 2. 알림 권한 상태를 먼저 확인
      const permission = Notification.permission;
      if (permission === 'denied') {
        console.warn('알림 권한이 차단되었습니다.');
        return;
      }

      // 3. 권한이 없으면 요청, 이미 있으면 바로 토큰 가져오기
      if (permission === 'default') {
        const result = await Notification.requestPermission();
        if (result !== 'granted') {
          console.log('알림 권한이 허용되지 않았습니다.');
          return;
        }
      }

      // 4. FCM 토큰 가져오기
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });

      if (!currentToken) {
        console.warn('FCM 토큰을 가져올 수 없습니다.');
        return;
      }

      // 5. 내가 알던 토큰과 다를 경우에만 서버에 업데이트
      const lastKnownToken = localStorage.getItem('sentFCMToken');

      if (currentToken !== lastKnownToken) {
        console.log('새 토큰을 발견하여 서버에 갱신을 시도합니다.');
        const deviceType = getDeviceType();

        const result = upsertFcmToken(userId, currentToken, deviceType)
          .then((res) => {
            if (res.status === 'success') {
              localStorage.setItem('sentFCMToken', currentToken);
            } else {
              console.warn('FCM 토큰 저장 실패:', res.message);
            }
          })
          .catch((error) => {
            console.error('FCM 토큰 저장 중 오류 발생:', error);
          });
      } else {
        console.log('토큰이 최신 상태입니다.');
      }
    } catch (error) {
      console.error('토큰 유효성 검사 중 오류:', error);
    }
  }, [isLoggedIn, userId]); // 로그인 상태나 유저 ID가 바뀌면 함수를 새로 만듦

  useEffect(() => {
    validateAndRefreshToken();

    document.addEventListener('visibilitychange', validateAndRefreshToken);

    return () => {
      document.removeEventListener('visibilitychange', validateAndRefreshToken);
    };
  }, [validateAndRefreshToken]);

  return (
    <Layout>
      <Layout.Header title="ProQ-Noti" handleBack={() => router.back()} />
      <Layout.Main>
        {/* Live Players Section */}
        {livePlayers.length > 0 && (
          <div className="flex justify-center w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="w-full max-w-7xl">
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-coral/50" />
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-coral rounded-full animate-pulse shadow-[0_0_10px_rgba(233,95,92,0.8)]" />
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider text-center">
                      Live Now
                    </h2>
                    <div className="w-3 h-3 bg-coral rounded-full animate-pulse shadow-[0_0_10px_rgba(233,95,92,0.8)]" />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-coral/50" />
                </div>
                <p className="text-sm md:text-base text-center text-gray-400 font-semibold">
                  {livePlayers.length}명의 프로게이머가 게임 중입니다
                </p>
              </div>

              {/* Live Players Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8">
                {livePlayers.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => router.push(`/subscribe/${player.team_abbr}`)}
                    className="group relative overflow-hidden p-4 bg-dark-card/80 backdrop-blur-sm border-2 border-coral/50 rounded-lg hover:border-coral hover:shadow-[0_0_20px_rgba(233,95,92,0.4)] transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Live indicator */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-coral rounded-full animate-pulse" />
                    </div>

                    {/* Player Info */}
                    <div className="flex flex-col items-center gap-2 text-center">
                      <p className="text-lg md:text-xl font-black text-white uppercase tracking-wide">
                        {player.pro_name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-400 font-semibold">
                        {player.team_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate w-full">
                        {player.summoner_name}#{player.tag_line}
                      </p>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-coral/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Selection */}
        <TeamGrid onSelectTeam={handleSelectTeam} teamList={teams} />
      </Layout.Main>
    </Layout >
  );
}
