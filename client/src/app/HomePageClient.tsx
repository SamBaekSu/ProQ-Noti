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

interface HomePageClientProps {
  initialTeams: Team[];
}

export default function HomePageClient({ initialTeams }: HomePageClientProps) {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  // We use initialTeams passed from Server Component
  const teams = initialTeams;

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
      <Layout.Header title="소속 팀 선택" handleBack={() => router.back()} />
      <Layout.Main>
        <div className="w-full max-w-md mx-auto">
          <TeamGrid onSelectTeam={handleSelectTeam} teamList={teams} />
        </div>
      </Layout.Main>
    </Layout>
  );
}
