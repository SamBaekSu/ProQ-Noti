'use client';

import { supabase } from '@/shared/lib/supabase/client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { storeLogin, storeLogout } from './authSlice';
import { useToast } from '@/shared/hooks/useToast';

export default function AuthProvider() {
  const dispatch = useDispatch();
  const isInitialized = useRef(false);
  const lastUserId = useRef<string | null>(null);
  const firstMount = useRef(true);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session) {
        lastUserId.current = session.user.id;
        dispatch(
          storeLogin({
            userId: session.user.id,
            email: session.user.email ?? null
          })
        );
      } else {
        lastUserId.current = null;
        dispatch(storeLogout());
      }

      isInitialized.current = true;
    };

    checkSession();

    // 실시간 세션 감지
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isInitialized.current) return;

        const currentUserId = session?.user.id || null;
        const userChanged = lastUserId.current !== currentUserId;

        if (session) {
          dispatch(
            storeLogin({
              userId: session.user.id,
              email: session.user.email ?? null
            })
          );
          if (!firstMount.current && userChanged) {
            toast({
              description: '로그인 되었습니다.'
            });
          }
          lastUserId.current = currentUserId;
        } else {
          dispatch(storeLogout());
          if (!firstMount.current && userChanged) {
            toast({
              description: '로그아웃 되었습니다.'
            });
          }
          lastUserId.current = null;
        }

        firstMount.current = false;
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch, toast, isClient]);

  return null;
}
