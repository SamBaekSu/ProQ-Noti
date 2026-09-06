import { NextResponse } from 'next/server';

const RIOT_API_KEY =
  process.env.RIOT_API_KEY ?? process.env.NEXT_PUBLIC_RIOT_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const summonerId = searchParams.get('summonerId');

  if (!summonerId) {
    return NextResponse.json(
      { error: 'summonerId 파라미터가 없습니다.' },
      { status: 400 }
    );
  }

  if (!RIOT_API_KEY) {
    return NextResponse.json(
      { error: 'Riot API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://kr.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${encodeURIComponent(summonerId)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );

    if (res.status === 404) {
      return NextResponse.json({ inGame: false });
    }

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: '게임 정보를 불러올 수 없습니다.', details: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ inGame: true, game: data });
  } catch (err) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
