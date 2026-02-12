import { useToast } from '@/shared/hooks/useToast';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import { storeLogout } from '@/shared/store/authSlice';
import { useIsLoggedIn, useUserId } from '@/shared/hooks/useAuth';
import { signOut } from '@/shared/lib/supabase/actions';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import { requestToken } from '@/shared/lib/firebase';

interface DropdownProps {
  isOpen?: boolean;
}

const Dropdown = ({ isOpen = false }: DropdownProps) => {
  const [open, setOpen] = useState(isOpen);
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
    toast({
      description: '로그아웃 되었습니다.'
    });
    // 클라이언트 컴포넌트에서는 window.location 사용
    window.location.href = '/';
  };

  return (
    <div ref={dropdownRef} className="absolute right-1 flex items-center">
      <button
        className="bg-none border-none cursor-pointer outline-none p-0"
        onClick={() => setOpen(!open)}
        aria-label="메뉴 열기"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <GiHamburgerMenu size={25} className="text-primary-navy" />
      </button>
      {open && (
        <div className="absolute top-8 right-0 bg-white shadow-md rounded z-50 border border-gray-300 text-base text-black web:w-[10rem] w-[6rem]">
          <ul className="list-none p-0 m-0">
            <li className="border-b border-gray-300 text-center hover:bg-gray-100 cursor-pointer">
              <Link href="/" className="block p-2 text-black no-underline">
                메인 화면
              </Link>
            </li>
            <li className="border-b border-gray-300 text-center hover:bg-gray-100 cursor-pointer">
              <a
                href="https://certain-gruyere-8ee.notion.site/ProQ-Noti-22fa948cd15380cbabc8f16ffe0ab5d3"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 text-black no-underline"
              >
                도움말
              </a>
            </li>
            {!isLoggedIn && (
              <li className="border-b border-gray-300 text-center hover:bg-gray-100 cursor-pointer">
                <Link
                  href="/login"
                  className="block p-2 text-black no-underline"
                >
                  로그인
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li className="border-b border-gray-300 text-center hover:bg-gray-100 cursor-pointer">
                <button
                  onClick={handleLogout}
                  className="block p-2 w-full text-black"
                >
                  로그아웃
                </button>
              </li>
            )}
            {isLoggedIn && (
              <li className="border-b border-gray-300 text-center hover:bg-gray-100 cursor-pointer">
                <Link
                  href="/userpage"
                  className="block p-2 text-black no-underline"
                >
                  마이페이지
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li className="text-center hover:bg-gray-100 cursor-pointer">
                <button
                  onClick={() => {
                    if (confirm('알림 권한을 재설정하시겠습니까?')) {
                      requestToken(userId, isLoggedIn);
                    }
                  }}
                  className="block p-2 w-full text-black"
                >
                  알림 재설정
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
