'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ArrowBack from '@/app/assets/icons/arrowBack.svg';
import { IoIosArrowBack } from 'react-icons/io';

import Dropdown from './dropdown';

// Header Props 타입 정의
interface HeaderProps {
  title?: string;
  handleBack?: () => void; // 필요 시 외부에서 주입 가능
  children?: ReactNode;
  option?: ReactNode;
}

// Header 컴포넌트
const Header = ({ title, handleBack, option, children }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="w-full h-[4rem] screen:h-[4.5rem] p-4 shadow-bottom">
      <div className="relative flex items-center justify-center w-full h-full">
        {/* 왼쪽 뒤로가기 버튼 */}
        {handleBack && (
          <button
            className="absolute left-1"
            aria-label="뒤로 가기"
            onClick={handleBack ?? (() => router.back())} // handleBack 없으면 기본 뒤로가기
          >
            <IoIosArrowBack size={30} />
          </button>
        )}

        {/* 중앙 영역 - children이 있으면 children, 없으면 기본 타이틀과 옵션 */}
        {children ? (
          children
        ) : (
          <>
            <h2 className="text-heading2">{title}</h2>
            {option}
          </>
        )}

        {/* 우측 드롭다운 (기존 유지) */}
        <Dropdown />
      </div>
    </header>
  );
};

// Main 컴포넌트
const Main = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative flex flex-col flex-grow w-full min-h-0 px-5 py-3 justify-center items-center">
      {children}
    </main>
  );
};

// Footer 컴포넌트
const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <footer className="w-full h-[5rem] min-h-[5rem] px-6 py-4 shadow-top">
      {children}
    </footer>
  );
};

// Layout 컴포넌트
export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col justify-center w-full h-full">{children}</div>
  );
};

// Layout 컴포넌트에 Header/Main/Footer 추가 (컴파운드 컴포넌트 패턴 유지)
Layout.Header = Header;
Layout.Main = Main;
Layout.Footer = Footer;
