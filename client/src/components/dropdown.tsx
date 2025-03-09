import useOutsideClick from '@/utils/hooks/useOutsideClick';
import { signOut } from '@/utils/supabase/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { PiDotsThreeCircle } from 'react-icons/pi';

interface DropdownProps {
  isOpen?: boolean;
}

const Dropdown = ({ isOpen = false }: DropdownProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(isOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, () =>
    setOpen(false)
  );

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <div ref={dropdownRef} className="absolute right-0">
      <button
        className="bg-none border-none cursor-pointer outline-none p-0"
        onClick={() => setOpen(!open)}
      >
        <PiDotsThreeCircle size={30} className="text-primary-navy" />
      </button>
      {open && (
        <div className="absolute top-6 right-0 bg-white shadow-md rounded z-50 border border-gray-300 text-sm text-black w-[5rem]">
          <ul className="list-none p-0 m-0">
            <li className="border-b border-gray-300 text-center hover:bg-gray-100 cursor-pointer">
              <Link href="/" className="p-2 block text-black no-underline">
                메인 화면
              </Link>
            </li>
            <li className="border-b border-gray-300 text-center hover:bg-gray-100 cursor-pointer">
              <Link href="/login" className="p-2 block text-black no-underline">
                로그인
              </Link>
            </li>
            <li className="text-center hover:bg-gray-100 cursor-pointer">
              <button
                onClick={handleLogout}
                className="block w-full text-black"
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
