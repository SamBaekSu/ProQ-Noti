'use client';

import { Layout } from '@/shared/ui/Layout';
import SubscribeList from '@/shared/ui/subscribeList';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerList } from '@/shared/hooks/usePlayer';
import SubscribeListSkeleton from '@/shared/ui/SubscribeSkeleton';
import { getToken } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/shared/lib/firebase';
import { getDeviceType } from '@/shared/lib/device';
import { useIsLoggedIn, useUserId } from '@/shared/hooks/useAuth';
import { upsertFcmToken } from '@/actions/fcm';
import type { IProPlayerData, gamerInfo } from '@/shared/types';

interface SubscribePageClientProps {
  teamName: string;
  initialPlayers: gamerInfo[];
}

export default function SubscribePageClient({
  teamName,
  initialPlayers
}: SubscribePageClientProps) {
  const router = useRouter();
  // teamName is passed from Server Component
  const { members, loading: dataLoading } = usePlayerList(
    teamName,
    initialPlayers
  );
  const [minLoading, setMinLoading] = useState(true);
  const isLoggedIn = useIsLoggedIn();
  const userId = useUserId();
  const messaging = getFirebaseMessaging();

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), 200);

    const permission = Notification.permission;

    if (isLoggedIn) {
      if ('Notification' in window && permission === 'default') {
        Notification.requestPermission().then((result) => {
          if (result === 'granted' && messaging) {
            getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            }).then((currentToken) => {
              if (currentToken) {
                const deviceType = getDeviceType();
                // FCM 토큰을 서버에 저장하는 Server Action 호출
                if (userId) {
                  const result = upsertFcmToken(userId, currentToken, deviceType)
                    .then((res) => {
                      if (res.status === 'success') {
                        console.log(currentToken);
                      } else {
                        console.warn('FCM 토큰 저장 실패:', res.message);
                      }
                    })
                    .catch((error) => {
                      console.error('FCM 토큰 저장 중 오류 발생:', error);
                    });
                } else {
                  console.warn(
                    '로그인 되지 않은 상태에서 FCM 토큰을 저장할 수 없습니다.'
                  );
                }
              } else {
                console.warn('fcm 토큰을 가져올 수 없습니다.');
              }
            });
          }
        });
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [teamName, isLoggedIn, messaging, userId]);

  const loading = dataLoading || minLoading;

  return (
    <>
      <Layout>
        <Layout.Header title={teamName} handleBack={() => router.back()} />
        <Layout.Main>
          <div className="my-6">
            {loading ? (
              <SubscribeListSkeleton />
            ) : (
              <SubscribeList list={members as IProPlayerData[]} />
            )}
          </div>
          <div className="flex w-full justify-end mt-2">
            <a
              href="https://forms.gle/r8jky7uKPyCMuwdR6"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              계정 추가 제보
            </a>
          </div>
        </Layout.Main>
      </Layout>
    </>
  );
}
