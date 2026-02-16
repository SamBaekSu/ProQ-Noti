'use client';

import { useRef, useState, useEffect } from 'react';
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
import { ConfirmDialog } from './ConfirmDialog';
import { useTheme, type ThemeType } from '@/shared/contexts/ThemeContext';

interface DropdownProps {
  isOpen?: boolean;
}

const Dropdown = ({ isOpen = false }: DropdownProps) => {
  const [open, setOpen] = useState(isOpen);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const dispatch = useDispatch();
  const { toast } = useToast();
  const isLoggedIn = useIsLoggedIn();
  const userId = useUserId();
  const { theme, setTheme } = useTheme();

  useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, () =>
    setOpen(false)
  );

  // 스크롤/리사이즈 시 드롭다운 위치 업데이트
  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

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
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
    >
      {/* Menu Toggle Button - OP.GG style */}
      <button
        ref={buttonRef}
        style={{
          padding: '12px',
          backgroundColor: '#262a3a',
          border: '1px solid',
          borderColor: open ? '#5383e8' : '#2d3748',
          boxShadow: open ? '0 0 15px rgba(83, 131, 232, 0.4)' : 'none',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#5383e8';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(83, 131, 232, 0.4)';
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor = '#2d3748';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
        onClick={(e) => {
          e.stopPropagation();

          // 버튼 위치 계산
          if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
              top: rect.bottom + 8, // 버튼 아래 8px
              right: window.innerWidth - rect.right, // 오른쪽 정렬
            });
          }

          setOpen(!open);
        }}
        aria-label="메뉴"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {open ? (
          <IoClose style={{ width: '24px', height: '24px', color: '#ffffff', transition: 'transform 0.2s' }} aria-hidden="true" />
        ) : (
          <GiHamburgerMenu style={{ width: '24px', height: '24px', color: '#d1d5db', transition: 'all 0.2s' }} aria-hidden="true" />
        )}
      </button>

      {/* Dropdown Menu - OP.GG dark style */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
            minWidth: '224px',
            backgroundColor: '#1a1d29',
            border: '1px solid #2d3748',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            overflow: 'hidden',
          }}
          role="menu"
        >
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Regular Menu Items - Gaming style */}
            {menuItems.map((item, index) => (
              <div
                key={index}
                style={{
                  borderBottom: index < menuItems.length - 1 ? '1px solid #2d3748' : 'none'
                }}
              >
                {item.type === 'external' ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 20px',
                      fontSize: '14px',
                      color: '#d1d5db',
                      fontWeight: '600',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2d3748';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#d1d5db';
                    }}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 20px',
                      fontSize: '14px',
                      color: '#d1d5db',
                      fontWeight: '600',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2d3748';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#d1d5db';
                    }}
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
                <div style={{ borderTop: '1px solid #2d3748' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 20px',
                      fontSize: '14px',
                      color: '#f87171',
                      fontWeight: '700',
                      textAlign: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.color = '#fca5a5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#f87171';
                    }}
                    role="menuitem"
                  >
                    로그아웃
                  </button>
                </div>

                {/* Notification Settings - Gaming accent */}
                <div style={{ borderBottom: '1px solid #2d3748' }}>
                  <button
                    onClick={() => {
                      setShowConfirmDialog(true);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '16px 20px',
                      fontSize: '16px',
                      color: '#79ceb8',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textAlign: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(121, 206, 184, 0.2)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.boxShadow = 'inset 4px 0 0 0 rgba(121, 206, 184, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#79ceb8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    role="menuitem"
                  >
                    알림 재설정
                  </button>
                </div>
              </>
            )}

            {/* Theme Selector */}
            <div style={{ padding: '16px', backgroundColor: 'rgba(26, 29, 41, 0.5)' }}>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                Theme
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {(['dark', 'white', 'blue', 'pink'] as ThemeType[]).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => {
                      setTheme(themeOption);
                      toast({
                        description: `${themeOption.charAt(0).toUpperCase() + themeOption.slice(1)} 테마로 변경되었습니다.`
                      });
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: '2px solid',
                      borderColor: theme === themeOption ? '#5383e8' : '#2d3748',
                      backgroundColor: theme === themeOption ? 'rgba(83, 131, 232, 0.2)' : '#262a3a',
                      color: theme === themeOption ? '#5383e8' : '#9ca3af',
                      boxShadow: theme === themeOption ? '0 0 15px rgba(83, 131, 232, 0.4)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => {
                      if (theme !== themeOption) {
                        e.currentTarget.style.borderColor = '#6b7280';
                        e.currentTarget.style.color = '#d1d5db';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== themeOption) {
                        e.currentTarget.style.borderColor = '#2d3748';
                        e.currentTarget.style.color = '#9ca3af';
                      }
                    }}
                    aria-label={`${themeOption} 테마 선택`}
                    aria-pressed={theme === themeOption}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor:
                          themeOption === 'dark' ? '#1f2937' :
                          themeOption === 'white' ? '#ffffff' :
                          themeOption === 'blue' ? '#3b82f6' :
                          '#ec4899',
                        border: themeOption === 'white' ? '1px solid #d1d5db' : 'none',
                      }}
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
