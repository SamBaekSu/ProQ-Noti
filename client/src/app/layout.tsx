import { Metadata } from 'next';
import './globals.css';
import Providers from './provider';
import Pwa from './Pwa';
import LayoutRouter from './layoutRouter';
import AuthProvider from '@/shared/store/AuthProvider';

export const metadata: Metadata = {
  title: 'ProQ-Noti | 프로들의 협곡을 실시간으로',
  description:
    'ProQ-Noti는 프로게이머들의 솔로랭크 상태를 실시간으로 확인하고 알림을 받을 수 있는 서비스입니다.',
  keywords: [
    'LOL',
    'League of Legends',
    'Pro Gamer',
    'In-game Notification',
    'LCK',
    'LCK Notification'
  ],
  openGraph: {
    title: 'ProQ-Noti | 프로들의 협곡을 실시간으로',
    description:
      '프로게이머들의 솔로랭크 상태를 실시간으로 확인하고 알림을 받을 수 있는 서비스입니다.',
    url: 'https://proq-noti.vercel.app',
    siteName: 'ProQ-Noti',
    images: [
      {
        url: '/og-image.png', // Ensure this file exists in public/
        width: 1200,
        height: 630
      }
    ],
    locale: 'ko_KR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProQ-Noti | 프로들의 협곡을 실시간으로',
    description:
      '프로게이머들의 솔로랭크 상태를 실시간으로 확인하고 알림을 받을 수 있는 서비스입니다.',
    images: ['/og-image.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className="flex justify-center w-full min-h-screen"
        suppressHydrationWarning
      >
        <Providers>
          <AuthProvider />
          <LayoutRouter>{children}</LayoutRouter>
        </Providers>
      </body>
      <Pwa />
    </html>
  );
}
