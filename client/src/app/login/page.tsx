'use client';

import { Layout } from '@/shared/ui/Layout';
import { signInWithGoogle, signInWithKakao } from '@/shared/lib/supabase/actions';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';

export default function Login() {
  const router = useRouter();

  return (
    <Layout>
      <Layout.Header title="로그인" handleBack={() => router.back()} />
      <Layout.Main>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center flex-1 w-full gap-4 mb-[32px]">
            <div className="flex justify-center w-[20.69rem] lg:w-[30rem]">
              <button
                onClick={signInWithKakao}
                className="flex items-center w-full h-[3.437rem] lg:h-[3.25rem]
                  bg-[#FEEA1C] border-2 border-[#FEEA1C] text-black text-lg font-black
                  cursor-pointer hover:bg-[#F4DC00] hover:shadow-[0_0_20px_rgba(254,234,28,0.5)]
                  focus:ring-2 focus:ring-offset-2 focus:ring-[#F4DC00] focus:outline-none
                  transition-all duration-200 uppercase tracking-wide"
                aria-label="카카오 로그인"
              >
                <div className="flex items-center justify-center w-12 h-full pl-3">
                  <RiKakaoTalkFill size={36} />
                </div>
                <span className="flex-grow mr-6">카카오 로그인</span>
              </button>
            </div>
            <div className="flex justify-center w-[20.69rem] lg:w-[30rem]">
              <button
                onClick={signInWithGoogle}
                className="flex items-center justify-center w-full h-[3.437rem] lg:h-[3.25rem]
                  bg-dark-card border-2 border-dark-border text-white text-lg font-bold
                  cursor-pointer hover:border-gray-500 hover:shadow-[0_0_20px_rgba(66,133,244,0.3)]
                  focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none
                  transition-all duration-200"
                aria-label="구글 로그인"
              >
                <div className="flex items-center justify-center w-12 h-full pl-3">
                  <FaGoogle size={24} className="text-blue-500" />
                </div>
                <span className="flex-grow mr-6">구글 로그인</span>
              </button>
            </div>
          </div>
        </div>
      </Layout.Main>
    </Layout>
  );
}
