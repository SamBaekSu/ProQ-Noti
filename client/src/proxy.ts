import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/shared/lib/supabase/middleware';
import { createClientForServer } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function proxy(request: NextRequest) {
  const supabase = await createClientForServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const protectedPaths = ['/userpage'];

  //1. 유저가 없는데 보호된 경로 접근시
  if (!user && protectedPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  //2. 유저가 있는데 로그인 페이지에 접근시
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/userpage';
    return NextResponse.redirect(url);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
