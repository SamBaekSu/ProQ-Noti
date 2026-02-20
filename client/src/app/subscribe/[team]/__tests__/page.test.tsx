import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SubscribePage, { generateMetadata } from '../page';

// Mock getPlayersWithSubscription
vi.mock('@/shared/api/queries/players', () => ({
  getPlayersWithSubscription: vi.fn()
}));

// Mock createClientForServer
vi.mock('@/shared/lib/supabase/server', () => ({
  createClientForServer: vi.fn(() => ({
    auth: {
      getUser: vi.fn()
    }
  }))
}));

// Mock SubscribePageClient
vi.mock('../SubscribePageClient', () => ({
  default: ({ teamName, initialPlayers }: any) => (
    <div data-testid="subscribe-page-client">
      <h1>{teamName}</h1>
      <div data-testid="players-count">{initialPlayers.length}</div>
      {initialPlayers.map((player: any) => (
        <div key={player.id} data-testid={`player-${player.id}`}>
          {player.pro_name}
        </div>
      ))}
    </div>
  )
}));

describe('SubscribePage', () => {
  const mockPlayers = [
    {
      id: 1,
      pro_name: 'Faker',
      is_online: true,
      is_subscribed: false
    },
    {
      id: 2,
      pro_name: 'Keria',
      is_online: false,
      is_subscribed: true
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render subscribe page with team name', async () => {
    const { createClientForServer } = await import('@/shared/lib/supabase/server');
    const { getPlayersWithSubscription } = await import('@/shared/api/queries/players');

    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    (createClientForServer as any).mockResolvedValue({ auth: { getUser: mockGetUser } });
    (getPlayersWithSubscription as any).mockResolvedValue(mockPlayers);

    const params = Promise.resolve({ team: 'T1' });
    const component = await SubscribePage({ params });

    render(component);

    expect(screen.getByText('T1')).toBeInTheDocument();
  });

  it('should fetch players with user ID when logged in', async () => {
    const { createClientForServer } = await import('@/shared/lib/supabase/server');
    const { getPlayersWithSubscription } = await import('@/shared/api/queries/players');

    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null });
    (createClientForServer as any).mockResolvedValue({ auth: { getUser: mockGetUser } });
    (getPlayersWithSubscription as any).mockResolvedValue(mockPlayers);

    const params = Promise.resolve({ team: 'T1' });
    await SubscribePage({ params });

    expect(getPlayersWithSubscription).toHaveBeenCalledWith(
      'T1',
      'user-123'
    );
  });

  it('should fetch players without user ID when not logged in', async () => {
    const { createClientForServer } = await import('@/shared/lib/supabase/server');
    const { getPlayersWithSubscription } = await import('@/shared/api/queries/players');

    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    (createClientForServer as any).mockResolvedValue({ auth: { getUser: mockGetUser } });
    (getPlayersWithSubscription as any).mockResolvedValue(mockPlayers);

    const params = Promise.resolve({ team: 'GEN' });
    await SubscribePage({ params });

    expect(getPlayersWithSubscription).toHaveBeenCalledWith('GEN', undefined);
  });

  it('should pass initial players to client component', async () => {
    const { createClientForServer } = await import('@/shared/lib/supabase/server');
    const { getPlayersWithSubscription } = await import('@/shared/api/queries/players');

    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    (createClientForServer as any).mockResolvedValue({ auth: { getUser: mockGetUser } });
    (getPlayersWithSubscription as any).mockResolvedValue(mockPlayers);

    const params = Promise.resolve({ team: 'T1' });
    const component = await SubscribePage({ params });

    render(component);

    expect(screen.getByTestId('players-count')).toHaveTextContent('2');
    expect(screen.getByTestId('player-1')).toHaveTextContent('Faker');
    expect(screen.getByTestId('player-2')).toHaveTextContent('Keria');
  });

  it('should decode URI encoded team name', async () => {
    const { createClientForServer } = await import('@/shared/lib/supabase/server');
    const { getPlayersWithSubscription } = await import('@/shared/api/queries/players');

    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    (createClientForServer as any).mockResolvedValue({ auth: { getUser: mockGetUser } });
    (getPlayersWithSubscription as any).mockResolvedValue([]);

    const params = Promise.resolve({ team: '%ED%8C%80%201' }); // "팀 1" encoded
    const component = await SubscribePage({ params });

    render(component);

    expect(screen.getByText('팀 1')).toBeInTheDocument();
  });

  it('should handle empty players list', async () => {
    const { createClientForServer } = await import('@/shared/lib/supabase/server');
    const { getPlayersWithSubscription } = await import('@/shared/api/queries/players');

    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    (createClientForServer as any).mockResolvedValue({ auth: { getUser: mockGetUser } });
    (getPlayersWithSubscription as any).mockResolvedValue([]);

    const params = Promise.resolve({ team: 'T1' });
    const component = await SubscribePage({ params });

    render(component);

    expect(screen.getByTestId('players-count')).toHaveTextContent('0');
  });

  it('should generate correct metadata', async () => {
    const params = Promise.resolve({ team: 'T1' });
    const metadata = await generateMetadata({ params });

    expect(metadata.title).toBe('ProQ-Noti | T1');
    expect(metadata.description).toBe('T1 선수들의 실시간 게임 상태를 확인하세요.');
  });

  it('should generate metadata with decoded team name', async () => {
    const params = Promise.resolve({ team: '%ED%8C%80%201' });
    const metadata = await generateMetadata({ params });

    expect(metadata.title).toBe('ProQ-Noti | 팀 1');
  });
});
