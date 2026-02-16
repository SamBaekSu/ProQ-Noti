'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import Dropdown from './dropdown';
import { cn } from '@/shared/lib/utils';
import { BUTTON_PADDING, FOCUS_RING } from '@/shared/lib/component-utils';

/**
 * Header Props - 헤더 컴포넌트 설정
 * @property title - 헤더 제목
 * @property handleBack - 뒤로가기 버튼 클릭 핸들러
 * @property children - 헤더 중앙에 표시할 커스텀 콘텐츠
 * @property option - 제목 우측에 표시할 옵션 (deprecated, children 사용 권장)
 */
interface HeaderProps {
  title?: string;
  handleBack?: () => void;
  children?: ReactNode;
  option?: ReactNode;
}

/**
 * Header Component - 반응형 헤더
 * Desktop: 56px (h-14)
 * Tablet/Mobile: 64px (h-16)
 */
const Header = ({ title, handleBack, option, children }: HeaderProps) => {
  const router = useRouter();

  return (
    <header
      className={cn(
        'w-full',
        'h-16 md:h-18 lg:h-20',
        'px-4 md:px-6 lg:px-8',
        'bg-opgg-bg-secondary/95 backdrop-blur-xl',
        'border-b border-opgg-border',
        'sticky top-0 z-sticky'
      )}
    >

      {/* Flex Container */}
      <div className="flex items-center justify-between h-full gap-3">
        {/* 왼쪽: 뒤로가기 버튼 */}
        <div className="flex items-center flex-shrink-0">
          {handleBack && (
            <button
              className={cn(
                'p-2.5',
                'bg-dark-hover border-2 border-dark-border',
                'hover:border-coral hover:shadow-[0_0_15px_rgba(233,95,92,0.4)]',
                'active:scale-95',
                'transition-all duration-200',
                'group'
              )}
              aria-label="뒤로 가기"
              onClick={handleBack || (() => router.back())}
            >
              <IoIosArrowBack
                className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors"
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* 중앙: 제목 */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          {children ? (
            children
          ) : (
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-xl md:text-2xl lg:text-3xl text-white font-black uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(233,95,92,0.3)] truncate">
                {title}
              </h1>
              {option}
            </div>
          )}
        </div>

        {/* 오른쪽: 드롭다운 메뉴 */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Dropdown />
        </div>
      </div>
    </header>
  );
};

/**
 * Main Component - 메인 콘텐츠 영역
 * 반응형 패딩 적용
 */
interface MainProps {
  children: ReactNode;
  className?: string;
}

const Main = ({ children, className = '' }: MainProps) => {
  return (
    <main
      className={cn(
        'relative flex flex-col flex-grow w-full',
        'bg-background',
        'overflow-y-auto',
        className
      )}
    >
      {children}
    </main>
  );
};

/**
 * Footer Component - 푸터 영역
 * 모바일: 80px
 * Tablet: 72px
 */
interface FooterProps {
  children: ReactNode;
  className?: string;
}

const Footer = ({ children, className = '' }: FooterProps) => {
  return (
    <footer
      className={cn(
        'w-full',
        'h-18 md:h-20 lg:h-22',
        'px-4 md:px-6 lg:px-8',
        'py-4 md:py-5 lg:py-6',
        'bg-opgg-bg-secondary/95 backdrop-blur-xl',
        'border-t border-opgg-border',
        'shadow-[0_-4px_20px_rgba(0,0,0,0.5)]',
        'flex items-center justify-center',
        className
      )}
    >
      {children}
    </footer>
  );
};

/**
 * Layout Component - 레이아웃 래퍼
 * Compound component pattern 사용
 */
interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className={cn('flex flex-col w-full min-h-screen', className)}>
      {children}
    </div>
  );
};

// Compound components 추가
Layout.Header = Header;
Layout.Main = Main;
Layout.Footer = Footer;
