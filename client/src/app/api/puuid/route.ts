import { NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const puuid = searchParams.get('puuid');

  if (!puuid) {
    return NextResponse.json({ error: '못찾음 파라미터' }, { status: 400 });
  }

  try {
    const riotResponse = await fetch(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY!
        }
      }
    );

    if (!riotResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Riot account data' },
        { status: riotResponse.status }
      );
    }

    const data = await riotResponse.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
