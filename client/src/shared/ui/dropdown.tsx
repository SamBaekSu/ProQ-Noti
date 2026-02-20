'use client';

import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { useToast } from '@/shared/hooks/useToast';
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
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const dispatch = useDispatch();
  const { toast } = useToast();
  const isLoggedIn = useIsLoggedIn();
  const userId = useUserId();
  const { theme, setTheme } = useTheme();

  // portal 메뉴가 dropdownRef 바깥에 렌더링되므로 두 ref 모두 체크
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const inTrigger = dropdownRef.current?.contains(target) ?? false;
      const inMenu = menuRef.current?.contains(target) ?? false;
      if (!inTrigger && !inMenu) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // SSR 이후 portal 마운트
  useEffect(() => {
    setMounted(true);
  }, []);

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
          backgroundColor: 'var(--dropdown-trigger-bg)',
          border: '1px solid',
          borderColor: open ? 'var(--dropdown-accent)' : 'var(--dropdown-border)',
          boxShadow: open ? 'var(--dropdown-accent-shadow)' : 'none',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.setProperty('border-color', 'var(--dropdown-accent)');
          e.currentTarget.style.setProperty('box-shadow', 'var(--dropdown-accent-shadow)');
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.setProperty('border-color', 'var(--dropdown-border)');
            e.currentTarget.style.setProperty('box-shadow', 'none');
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
          <IoClose style={{ width: '24px', height: '24px', color: 'var(--dropdown-item-text-hover)', transition: 'transform 0.2s' }} aria-hidden="true" />
        ) : (
          <GiHamburgerMenu style={{ width: '24px', height: '24px', color: 'var(--dropdown-item-text)', transition: 'all 0.2s' }} aria-hidden="true" />
        )}
      </button>

      {/* Dropdown Menu - OP.GG dark style (portal로 헤더 stacking context 탈출) */}
      {open && mounted && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
            minWidth: '224px',
            backgroundColor: 'var(--dropdown-bg)',
            border: '1px solid var(--dropdown-border)',
            borderRadius: '8px',
            boxShadow: 'var(--dropdown-shadow)',
            zIndex: 9999,
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
                  borderBottom: index < menuItems.length - 1 ? '1px solid var(--dropdown-border)' : 'none'
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
                      color: 'var(--dropdown-item-text)',
                      fontWeight: '600',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.setProperty('background-color', 'var(--dropdown-item-hover-bg)');
                      e.currentTarget.style.setProperty('color', 'var(--dropdown-item-text-hover)');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.setProperty('background-color', 'transparent');
                      e.currentTarget.style.setProperty('color', 'var(--dropdown-item-text)');
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
                      color: 'var(--dropdown-item-text)',
                      fontWeight: '600',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.setProperty('background-color', 'var(--dropdown-item-hover-bg)');
                      e.currentTarget.style.setProperty('color', 'var(--dropdown-item-text-hover)');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.setProperty('background-color', 'transparent');
                      e.currentTarget.style.setProperty('color', 'var(--dropdown-item-text)');
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
                <div style={{ borderTop: '1px solid var(--dropdown-border)' }}>
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
                <div style={{ borderBottom: '1px solid var(--dropdown-border)' }}>
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
            <div style={{ padding: '16px', backgroundColor: 'var(--dropdown-section-bg)' }}>
              <p style={{
                fontSize: '12px',
                color: 'var(--dropdown-item-muted)',
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
                      borderColor: theme === themeOption ? 'var(--dropdown-accent)' : 'var(--dropdown-border)',
                      backgroundColor: theme === themeOption ? 'var(--dropdown-accent-bg)' : 'var(--dropdown-trigger-bg)',
                      color: theme === themeOption ? 'var(--dropdown-accent)' : 'var(--dropdown-item-muted)',
                      boxShadow: theme === themeOption ? 'var(--dropdown-accent-shadow)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => {
                      if (theme !== themeOption) {
                        e.currentTarget.style.setProperty('border-color', 'var(--dropdown-btn-hover-border)');
                        e.currentTarget.style.setProperty('color', 'var(--dropdown-item-text)');
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== themeOption) {
                        e.currentTarget.style.setProperty('border-color', 'var(--dropdown-border)');
                        e.currentTarget.style.setProperty('color', 'var(--dropdown-item-muted)');
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
        </div>,
        document.body
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
