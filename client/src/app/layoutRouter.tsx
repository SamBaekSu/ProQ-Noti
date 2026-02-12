// LayoutWrapper.tsx (클라이언트 컴포넌트)
'use client';

import { Toaster } from '@/shared/ui/ui/toaster';
import { usePathname } from 'next/navigation';

export default function LayoutRouter({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getBgColor = () => {
    if (pathname === '/' || pathname.startsWith('/subscribe/'))
      return 'bg-primary-skyblue';
    if (['/login', '/userpage'].includes(pathname)) return 'bg-primary-mint';
    return 'bg-primary-white';
  };

  return (
    <div
      className={`flex flex-col ${getBgColor()} w-full min-w-[21.875rem] max-w-[46.785rem] h-auto shadow-lg`}
    >
      {children}
      <Toaster />
    </div>
  );
}
