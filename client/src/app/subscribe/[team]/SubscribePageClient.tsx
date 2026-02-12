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
  const { members, loading } = usePlayerList(
    teamName,
    initialPlayers
  );
  const isLoggedIn = useIsLoggedIn();
  const userId = useUserId();
  const messaging = getFirebaseMessaging();

  // FCM 토큰 등록 - 한 번만 실행
  useEffect(() => {
    if (!isLoggedIn || !userId || !messaging) return;

    const permission = Notification.permission;

    // 권한이 default인 경우에만 요청
    if ('Notification' in window && permission === 'default') {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
          }).then((currentToken) => {
            if (currentToken && userId) {
              const deviceType = getDeviceType();
              upsertFcmToken(userId, currentToken, deviceType)
                .then((res) => {
                  if (res.status === 'success') {
                    console.log('FCM 토큰 등록 완료:', currentToken);
                  } else {
                    console.warn('FCM 토큰 저장 실패:', res.message);
                  }
                })
                .catch((error) => {
                  console.error('FCM 토큰 저장 중 오류 발생:', error);
                });
            }
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userId]); // teamName 의존성 제거 - 페이지 이동 시마다 실행될 필요 없음

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
