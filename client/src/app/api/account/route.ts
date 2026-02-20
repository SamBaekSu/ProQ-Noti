import { NextRequest, NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: 'gameName and tagLine are required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY!
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Riot API 요청 실패: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: '서버 에러' }, { status: 500 });
  }
}
