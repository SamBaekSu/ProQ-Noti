import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockMatchResponse = {
  info: {
    gameId: 123,
    participants: []
  }
};

async function loadRoute() {
  vi.resetModules();
  return import('../route');
}

function createRequest(matchId: string) {
  return new Request(
    `http://localhost/api/match?matchId=${encodeURIComponent(matchId)}`
  );
}

describe('/api/match', () => {
  beforeEach(() => {
    vi.stubEnv('RIOT_API_KEY', 'test-riot-key');
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(mockMatchResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      )
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uses the Asia match router for KR match ids', async () => {
    const { GET } = await loadRoute();

    await GET(createRequest('KR_1234567890'));

    expect(fetch).toHaveBeenCalledWith(
      'https://asia.api.riotgames.com/lol/match/v5/matches/KR_1234567890',
      expect.any(Object)
    );
  });

  it('uses the Europe match router for EUW match ids', async () => {
    const { GET } = await loadRoute();

    await GET(createRequest('EUW1_1234567890'));

    expect(fetch).toHaveBeenCalledWith(
      'https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_1234567890',
      expect.any(Object)
    );
  });

  it('uses the Americas match router for NA match ids', async () => {
    const { GET } = await loadRoute();

    await GET(createRequest('NA1_1234567890'));

    expect(fetch).toHaveBeenCalledWith(
      'https://americas.api.riotgames.com/lol/match/v5/matches/NA1_1234567890',
      expect.any(Object)
    );
  });
});
