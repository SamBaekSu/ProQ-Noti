"use client";

import { signInWithGoogle, signInWithKakao } from "@/utils/supabase/actions";
import { FaGoogle } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function Login() {

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-4">
        <div className="flex justify-center w-[20.69rem] web:w-[30rem]">
          <button
            onClick={signInWithKakao}
            className="flex items-center w-full h-[3.13rem] web:h-[3.25rem] bg-[#FEEA1C] text-black text-lg rounded-lg cursor-pointer hover:bg-[#F4DC00] focus:ring-2 focus:ring-offset-2 focus:ring-[#F4DC00] focus:outline-none"
            aria-label="카카오 로그인"
          >
            <div className="flex items-center justify-center w-12 h-full pl-3 rounded-l-lg">
              <RiKakaoTalkFill size={36} />
            </div>
            <span className="flex-grow mr-6">카카오 로그인</span>
          </button>
        </div>
        <div className="flex justify-center w-[20.69rem] web:w-[30rem]">
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center w-full h-[3.13rem] web:h-[3.25rem] 
              bg-white border border-gray-300 text-gray-700 text-lg rounded-lg 
              cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 
              focus:ring-gray-300 focus:outline-none shadow-md"
            aria-label="구글 로그인"
          >
            <div className="flex items-center justify-center w-12 h-full pl-3 rounded-l-lg">
              <FaGoogle size={24} className="text-red-500" />
            </div>
            <span className="flex-grow mr-6">구글 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}