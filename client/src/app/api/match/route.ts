import { NextResponse } from 'next/server';

const RIOT_API_KEY =
  process.env.RIOT_API_KEY ?? process.env.NEXT_PUBLIC_RIOT_API_KEY;

const MATCH_REGIONS_BY_PLATFORM: Record<string, string> = {
  BR1: 'americas',
  LA1: 'americas',
  LA2: 'americas',
  NA1: 'americas',
  JP1: 'asia',
  KR: 'asia',
  EUN1: 'europe',
  EUW1: 'europe',
  ME1: 'europe',
  RU: 'europe',
  TR1: 'europe',
  OC1: 'sea',
  PH2: 'sea',
  SG2: 'sea',
  TH2: 'sea',
  TW2: 'sea',
  VN2: 'sea'
};

function getMatchRegion(matchId: string) {
  const platform = matchId.split('_')[0]?.toUpperCase();

  return MATCH_REGIONS_BY_PLATFORM[platform] ?? 'asia';
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json(
      { error: 'matchId 파라미터가 없습니다.' },
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
    const matchRegion = getMatchRegion(matchId);
    const res = await fetch(
      `https://${matchRegion}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        },
        cache: 'no-store'
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: '전적 정보를 불러올 수 없습니다.', details: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
