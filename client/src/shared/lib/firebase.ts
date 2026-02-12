'use client';

import { upsertFcmToken } from '@/actions/fcm';
import { toast } from '@/shared/hooks/useToast';
import { getDeviceType } from '@/shared/lib/device';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase 앱 초기화는 서버/클라이언트 양쪽에서 안전
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

let messaging: Messaging | null = null;

export const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window !== 'undefined') {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  }
  return null;
};

export const requestToken = (userId: string | null, isLoggedIn: boolean) => {
  if (typeof window === 'undefined') {
    toast({ description: '다른 화면을 들렀다가 시도해주세요' });
    return;
  }

  if (isLoggedIn) {
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
                    toast({ description: '알림이 재설정됐습니다' });
                    console.log('토큰', currentToken);
                    localStorage.setItem('sentFCMToken', currentToken);
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
      } else {
        toast({ description: '알림을 허용해주세요' });
      }
    });
  }
};

export { app };
