import { NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const summonerId = searchParams.get('summonerId');

  if (!summonerId) {
    return NextResponse.json(
      { error: 'summonerId 파라미터가 없습니다.' },
      { status: 400 }
    );
  }
  try {
    const res = await fetch(
      `https://kr.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${summonerId}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY!
        }
      }
    );

    if (res.status === 404) {
      return NextResponse.json({ inGame: false });
    }

    const data = await res.json();

    return NextResponse.json({ inGame: true, game: data });
  } catch (err) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
