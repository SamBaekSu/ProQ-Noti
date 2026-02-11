'use server';

import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

import { createClientForServer } from './server';

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClientForServer();

  const auth_callback_url = `${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url
    }
  });

  redirect(data.url as string);
};

const signInWithKakao = signInWith('kakao');
const signInWithGoogle = signInWith('google');

const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
};

export { signInWithKakao, signInWithGoogle, signOut };
