'use client';

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { useToast } from '@/shared/hooks/useToast';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import { storeLogout } from '@/shared/store/authSlice';
import { useIsLoggedIn, useUserId } from '@/shared/hooks/useAuth';
import { signOut } from '@/shared/lib/supabase/actions';
import { requestToken } from '@/shared/lib/firebase';
import { cn } from '@/shared/lib/utils';
import { ConfirmDialog } from './ConfirmDialog';

interface DropdownProps {
  isOpen?: boolean;
}

const Dropdown = ({ isOpen = false }: DropdownProps) => {
  const [open, setOpen] = useState(isOpen);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isLoggedIn = useIsLoggedIn();
  const userId = useUserId();

  useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, () =>
    setOpen(false)
  );

  const handleLogout = () => {
    signOut();
    dispatch(storeLogout());
    setOpen(false);
    toast({
      description: '로그아웃 되었습니다.'
    });
    window.location.href = '/';
  };

  const menuItems = [
    {
      label: '메인 화면',
      href: '/',
      type: 'link' as const
    },
    {
      label: '도움말',
      href: 'https://certain-gruyere-8ee.notion.site/ProQ-Noti-22fa948cd15380cbabc8f16ffe0ab5d3',
      type: 'external' as const
    },
    ...(!isLoggedIn
      ? [
          {
            label: '로그인',
            href: '/login',
            type: 'link' as const
          }
        ]
      : []),
    ...(isLoggedIn
      ? [
          {
            label: '마이페이지',
            href: '/userpage',
            type: 'link' as const
          }
        ]
      : [])
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-4 md:right-6 lg:right-8 flex items-center z-50"
    >
      {/* Menu Toggle Button - Gaming style */}
      <button
        className={cn(
          'p-3',
          'bg-dark-hover border-2',
          open ? 'border-coral shadow-[0_0_15px_rgba(233,95,92,0.5)]' : 'border-dark-border',
          'hover:border-coral hover:shadow-[0_0_15px_rgba(233,95,92,0.4)]',
          'active:scale-95',
          'transition-all duration-200',
          'flex items-center justify-center',
          'group'
        )}
        onClick={() => setOpen(!open)}
        aria-label="메뉴"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {open ? (
          <IoClose className="w-6 h-6 text-white transition-transform group-hover:rotate-90" aria-hidden="true" />
        ) : (
          <GiHamburgerMenu className="w-6 h-6 text-gray-300 group-hover:text-white transition-all group-hover:scale-110" aria-hidden="true" />
        )}
      </button>

      {/* Dropdown Menu - Gaming dark style */}
      {open && (
        <div
          className={cn(
            'absolute top-14 md:top-16 right-0',
            'min-w-56 md:min-w-64',
            'bg-dark-card/95 backdrop-blur-lg',
            'border-2 border-dark-border',
            'shadow-[0_8px_32px_rgba(0,0,0,0.6)]',
            'z-50',
            'overflow-hidden',
            'animate-scale-in'
          )}
          role="menu"
        >
          <nav className="flex flex-col">
            {/* Regular Menu Items - Gaming style */}
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  index < menuItems.length && 'border-b-2 border-dark-border'
                )}
              >
                {item.type === 'external' ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block w-full px-5 py-4',
                      'text-base text-gray-300 font-bold uppercase tracking-wide',
                      'hover:bg-dark-hover hover:text-white hover:shadow-[inset_4px_0_0_0_rgba(233,95,92,1)]',
                      'active:bg-dark-border',
                      'transition-all duration-200',
                      'text-center'
                    )}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'block w-full px-5 py-4',
                      'text-base text-gray-300 font-bold uppercase tracking-wide',
                      'hover:bg-dark-hover hover:text-white hover:shadow-[inset_4px_0_0_0_rgba(233,95,92,1)]',
                      'active:bg-dark-border',
                      'transition-all duration-200',
                      'text-center'
                    )}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Logout Button - Gaming danger style */}
            {isLoggedIn && (
              <>
                <div className="border-b-2 border-dark-border">
                  <button
                    onClick={handleLogout}
                    className={cn(
                      'block w-full px-5 py-4',
                      'text-base text-red-400',
                      'hover:bg-red-500/20 hover:text-red-300 hover:shadow-[inset_4px_0_0_0_rgba(239,68,68,1)]',
                      'active:bg-red-500/30',
                      'transition-all duration-200',
                      'text-center',
                      'font-black uppercase tracking-wide'
                    )}
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>

                {/* Notification Settings - Gaming accent */}
                <button
                  onClick={() => {
                    setShowConfirmDialog(true);
                  }}
                  className={cn(
                    'block w-full px-5 py-4',
                    'text-base text-mint font-bold uppercase tracking-wide',
                    'hover:bg-mint/20 hover:text-white hover:shadow-[inset_4px_0_0_0_rgba(121,206,184,1)]',
                    'active:bg-mint/30',
                    'transition-all duration-200',
                    'text-center'
                  )}
                  role="menuitem"
                >
                  알림 재설정
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          requestToken(userId, isLoggedIn);
          setOpen(false);
        }}
        title="알림 재설정"
        message="알림 권한을 재설정하시겠습니까?"
        confirmText="재설정"
        variant="default"
      />
    </div>
  );
};

export default Dropdown;
