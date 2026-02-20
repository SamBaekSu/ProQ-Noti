'use client';

import { upsertFcmToken } from '@/actions/fcm';
import { toast } from '@/shared/hooks/useToast';
import { getDeviceType } from '@/shared/lib/device';

// Firebase는 필요할 때만 동적 import하여 초기 번들에서 제외
let appInstance: import('firebase/app').FirebaseApp | null = null;
let messagingInstance: import('firebase/messaging').Messaging | null = null;

async function getFirebaseApp() {
  if (appInstance) return appInstance;

  const { initializeApp, getApp, getApps } = await import('firebase/app');
  appInstance = !getApps().length
    ? initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
      })
    : getApp();

  return appInstance;
}

export const getFirebaseMessaging =
  async (): Promise<import('firebase/messaging').Messaging | null> => {
    if (typeof window === 'undefined') return null;

    if (messagingInstance) return messagingInstance;

    const app = await getFirebaseApp();
    const { getMessaging } = await import('firebase/messaging');
    messagingInstance = getMessaging(app);
    return messagingInstance;
  };

export const requestToken = (userId: string | null, isLoggedIn: boolean) => {
  if (typeof window === 'undefined') {
    toast({ description: '다른 화면을 들렀다가 시도해주세요' });
    return;
  }

  if (isLoggedIn) {
    Notification.requestPermission().then(async (result) => {
      if (result === 'granted') {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const { getToken } = await import('firebase/messaging');
        getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        }).then((currentToken) => {
          if (currentToken) {
            const deviceType = getDeviceType();
            if (userId) {
              upsertFcmToken(userId, currentToken, deviceType)
                .then((res) => {
                  if (res.status === 'success') {
                    toast({ description: '알림이 재설정됐습니다' });
                    localStorage.setItem('sentFCMToken', currentToken);
                  } else {
                    console.warn('FCM 토큰 저장 실패:', res.message);
                  }
                })
                .catch((error) => {
                  console.error('FCM 토큰 저장 중 오류 발생:', error);
                });
            } else {
              console.warn('로그인 되지 않은 상태에서 FCM 토큰을 저장할 수 없습니다.');
            }
          } else {
            console.warn('fcm 토큰을 가져올 수 없습니다.');
          }
        });
      } else {
        toast({ description: '알림을 허용해주세요' });
      }
    });
  }
};
