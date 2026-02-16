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

  return (
    <div
      className="flex flex-col bg-dark-bg w-full min-w-mobile min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1d29 100%)'
      }}
    >
      {children}
      <Toaster />
    </div>
  );
}
