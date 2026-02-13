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
import { useTheme, type ThemeType } from '@/shared/contexts/ThemeContext';

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
  const { theme, setTheme } = useTheme();

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
      className="relative flex items-center"
    >
      {/* Menu Toggle Button - OP.GG style */}
      <button
        className={cn(
          'p-3',
          'bg-dark-hover border',
          open ? 'border-opgg-blue shadow-glow-blue' : 'border-dark-border',
          'hover:border-opgg-blue hover:shadow-glow-blue',
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

      {/* Dropdown Menu - OP.GG dark style */}
      {open && (
        <div
          className={cn(
            'absolute top-14 md:top-16 right-0',
            'min-w-56 md:min-w-64',
            'bg-dark-card/98 backdrop-blur-xl',
            'border border-dark-border',
            'shadow-card',
            'z-dropdown',
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
                  index < menuItems.length && 'border-b border-dark-border'
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
                      'hover:bg-dark-hover hover:text-white hover:shadow-[inset_4px_0_0_0_rgba(83,131,232,1)]',
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
                      'hover:bg-dark-hover hover:text-white hover:shadow-[inset_4px_0_0_0_rgba(83,131,232,1)]',
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
                <div className="border-b border-dark-border">
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
                <div className="border-b border-dark-border">
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
                </div>
              </>
            )}

            {/* Theme Selector */}
            <div className="p-4 bg-dark-surface/50">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3 text-center">
                Theme
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(['dark', 'white', 'blue', 'pink'] as ThemeType[]).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => {
                      setTheme(themeOption);
                      toast({
                        description: `${themeOption.charAt(0).toUpperCase() + themeOption.slice(1)} 테마로 변경되었습니다.`
                      });
                    }}
                    className={cn(
                      'px-3 py-2 text-sm font-bold uppercase tracking-wide',
                      'border-2 transition-all duration-200',
                      'flex items-center justify-center gap-2',
                      theme === themeOption
                        ? 'bg-opgg-blue/20 border-opgg-blue text-opgg-blue shadow-glow-blue'
                        : 'bg-dark-hover border-dark-border text-gray-400 hover:border-gray-500 hover:text-gray-300'
                    )}
                    aria-label={`${themeOption} 테마 선택`}
                    aria-pressed={theme === themeOption}
                  >
                    <span
                      className={cn(
                        'w-3 h-3 rounded-full',
                        themeOption === 'dark' && 'bg-gray-800',
                        themeOption === 'white' && 'bg-white border border-gray-300',
                        themeOption === 'blue' && 'bg-blue-500',
                        themeOption === 'pink' && 'bg-pink-500'
                      )}
                    />
                    {themeOption}
                  </button>
                ))}
              </div>
            </div>
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
