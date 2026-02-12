import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UserPage from '../page';

// Mock hooks
vi.mock('@/shared/hooks/useAuth', () => ({
  useIsLoggedIn: vi.fn(),
  useUserId: vi.fn()
}));

// Mock Supabase client
vi.mock('@/shared/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

// Mock router with factory function
vi.mock('next/navigation', () => {
  const mockBack = vi.fn();
  const mockPush = vi.fn();
  return {
    useRouter: vi.fn(() => ({
      back: mockBack,
      push: mockPush
    })),
    __mockBack: mockBack,
    __mockPush: mockPush
  };
});

// Mock Layout
vi.mock('@/shared/ui/Layout', () => ({
  Layout: Object.assign(({ children }: any) => <div>{children}</div>, {
    Header: ({ title, handleBack }: any) => (
      <div>
        <h1>{title}</h1>
        <button onClick={handleBack}>Back</button>
      </div>
    ),
    Main: ({ children }: any) => <div>{children}</div>
  })
}));

// Mock SubscribeList
vi.mock('@/shared/ui/subscribeList', () => ({
  default: ({ list, onUnsubscribe }: any) => (
    <div data-testid="subscribe-list">
      {list.map((player: any) => (
        <div key={player.id} data-testid={`player-${player.id}`}>
          <span>{player.pro_name}</span>
          <button onClick={() => onUnsubscribe(player.id)}>Unsubscribe</button>
        </div>
      ))}
    </div>
  )
}));

// Mock DeleteAccountModal
vi.mock('@/shared/ui/modal/DeleteAccountModal', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
}));

describe('UserPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { supabase } = await import('@/shared/lib/supabase/client');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    (supabase.from as any).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => new Promise(() => {})) // Never resolves
      }))
    });

    render(<UserPage />);

    // Loading spinner should be present
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should show empty state when not logged in', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    (useIsLoggedIn as any).mockReturnValue(false);
    (useUserId as any).mockReturnValue(null);

    render(<UserPage />);

    await waitFor(() => {
      expect(screen.getByText(/구독한 프로게이머가 없습니다/)).toBeInTheDocument();
    });
  });

  it('should display subscription count', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { supabase } = await import('@/shared/lib/supabase/client');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    const mockSubscriptions = [
      {
        riot_pro_user_id: 1,
        created_at: '2024-01-01',
        riot_pro_users: {
          id: 1,
          pro_name: 'Faker',
          team_id: 1,
          position_number: 2,
          is_starter: true
        }
      }
    ];

    const mockRiotAccounts = [
      {
        pro_user_id: 1,
        summoner_name: 'Hide on bush',
        tag_line: 'KR1',
        puuid: 'puuid-123',
        is_online: true,
        is_main: true,
        last_online: null,
        last_match_id: null,
        streamer_mode: false
      }
    ];

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'subscribe') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() =>
              Promise.resolve({ data: mockSubscriptions, error: null })
            )
          }))
        };
      }
      if (table === 'riot_accounts') {
        return {
          select: vi.fn(() => ({
            in: vi.fn(() =>
              Promise.resolve({ data: mockRiotAccounts, error: null })
            )
          }))
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
    });

    render(<UserPage />);

    await waitFor(() => {
      expect(screen.getByText(/총 1명의 프로게이머를 구독중입니다/)).toBeInTheDocument();
    });
  });

  it('should render subscribe list with players', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { supabase } = await import('@/shared/lib/supabase/client');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    const mockSubscriptions = [
      {
        riot_pro_user_id: 1,
        created_at: '2024-01-01',
        riot_pro_users: {
          id: 1,
          pro_name: 'Faker',
          team_id: 1,
          position_number: 2,
          is_starter: true
        }
      }
    ];

    const mockRiotAccounts = [
      {
        pro_user_id: 1,
        summoner_name: 'Hide on bush',
        tag_line: 'KR1',
        puuid: 'puuid-123',
        is_online: true,
        is_main: true,
        last_online: null,
        last_match_id: null,
        streamer_mode: false
      }
    ];

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'subscribe') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() =>
              Promise.resolve({ data: mockSubscriptions, error: null })
            )
          })),
          delete: vi.fn(() => ({
            match: vi.fn(() => Promise.resolve({ error: null }))
          }))
        };
      }
      if (table === 'riot_accounts') {
        return {
          select: vi.fn(() => ({
            in: vi.fn(() =>
              Promise.resolve({ data: mockRiotAccounts, error: null })
            )
          }))
        };
      }
    });

    render(<UserPage />);

    await waitFor(() => {
      expect(screen.getByTestId('player-1')).toBeInTheDocument();
      expect(screen.getByText('Faker')).toBeInTheDocument();
    });
  });

  it('should open delete account modal when button is clicked', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { supabase } = await import('@/shared/lib/supabase/client');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    (supabase.from as any).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    });

    render(<UserPage />);

    await waitFor(() => {
      const deleteButton = screen.getByText('회원탈퇴');
      fireEvent.click(deleteButton);
    });

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('should handle unsubscribe action', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { supabase } = await import('@/shared/lib/supabase/client');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    const mockSubscriptions = [
      {
        riot_pro_user_id: 1,
        created_at: '2024-01-01',
        riot_pro_users: {
          id: 1,
          pro_name: 'Faker',
          team_id: 1,
          position_number: 2,
          is_starter: true
        }
      }
    ];

    const mockRiotAccounts = [
      {
        pro_user_id: 1,
        summoner_name: 'Hide on bush',
        tag_line: 'KR1',
        puuid: 'puuid-123',
        is_online: true,
        is_main: true,
        last_online: null,
        last_match_id: null,
        streamer_mode: false
      }
    ];

    const mockDelete = vi.fn(() => ({
      match: vi.fn(() => Promise.resolve({ error: null }))
    }));

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'subscribe') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() =>
              Promise.resolve({ data: mockSubscriptions, error: null })
            )
          })),
          delete: mockDelete
        };
      }
      if (table === 'riot_accounts') {
        return {
          select: vi.fn(() => ({
            in: vi.fn(() =>
              Promise.resolve({ data: mockRiotAccounts, error: null })
            )
          }))
        };
      }
    });

    render(<UserPage />);

    await waitFor(() => {
      const unsubscribeButton = screen.getByText('Unsubscribe');
      fireEvent.click(unsubscribeButton);
    });

    expect(mockDelete).toHaveBeenCalled();
  });

  it('should navigate to home when browse button is clicked in empty state', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { supabase } = await import('@/shared/lib/supabase/client');
    const navModule = await import('next/navigation');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    (supabase.from as any).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    });

    const mockPush = (navModule as any).__mockPush;

    render(<UserPage />);

    await waitFor(() => {
      const browseButton = screen.getByText('프로게이머 둘러보기');
      fireEvent.click(browseButton);
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
