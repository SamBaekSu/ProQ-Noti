import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import HomePageClient from '../HomePageClient';

// Mock hooks
vi.mock('@/shared/hooks/useAuth', () => ({
  useIsLoggedIn: vi.fn(),
  useUserId: vi.fn()
}));

// Mock router with factory function
vi.mock('next/navigation', () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();
  return {
    useRouter: vi.fn(() => ({
      push: mockPush,
      back: mockBack
    })),
    __mockPush: mockPush,
    __mockBack: mockBack
  };
});

// Mock firebase
vi.mock('@/shared/lib/firebase', () => ({
  getFirebaseMessaging: vi.fn(() => ({}))
}));

vi.mock('firebase/messaging', () => ({
  getToken: vi.fn()
}));

// Mock device
vi.mock('@/shared/lib/device', () => ({
  getDeviceType: vi.fn(() => 'web')
}));

// Mock actions
vi.mock('@/actions/fcm', () => ({
  upsertFcmToken: vi.fn(() => Promise.resolve({ status: 'success' }))
}));

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

// Mock TeamGrid
vi.mock('@/shared/ui/TeamGrid', () => ({
  TeamGrid: ({ teamList, onSelectTeam }: any) => (
    <div data-testid="team-grid">
      {teamList.map((team: any) => (
        <button
          key={team.id}
          data-testid={`team-${team.id}`}
          onClick={() => onSelectTeam(team.name_abbr)}
        >
          {team.name_abbr}
        </button>
      ))}
    </div>
  )
}));

describe('HomePageClient', () => {
  const mockTeams = [
    {
      id: 1,
      name_abbr: 'T1',
      name_prefix: 'T1',
      name_suffix: null,
      created_at: '2024-01-01'
    },
    {
      id: 2,
      name_abbr: 'GEN',
      name_prefix: 'Gen.G',
      name_suffix: null,
      created_at: '2024-01-01'
    }
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    (useIsLoggedIn as any).mockReturnValue(false);
    (useUserId as any).mockReturnValue(null);
  });

  it('should render home page with title', () => {
    render(<HomePageClient initialTeams={mockTeams} />);

    expect(screen.getByText('소속 팀 선택')).toBeInTheDocument();
  });

  it('should render team grid with teams', () => {
    render(<HomePageClient initialTeams={mockTeams} />);

    expect(screen.getByTestId('team-grid')).toBeInTheDocument();
    expect(screen.getByTestId('team-1')).toBeInTheDocument();
    expect(screen.getByTestId('team-2')).toBeInTheDocument();
  });

  it('should display team names', () => {
    render(<HomePageClient initialTeams={mockTeams} />);

    expect(screen.getByText('T1')).toBeInTheDocument();
    expect(screen.getByText('GEN')).toBeInTheDocument();
  });

  it('should navigate to team page when team is selected', async () => {
    const navModule = await import('next/navigation');
    const mockPush = (navModule as any).__mockPush;

    render(<HomePageClient initialTeams={mockTeams} />);

    const t1Button = screen.getByTestId('team-1');
    fireEvent.click(t1Button);

    expect(mockPush).toHaveBeenCalledWith('/subscribe/T1');
  });

  it('should navigate to correct team page for each team', async () => {
    const navModule = await import('next/navigation');
    const mockPush = (navModule as any).__mockPush;

    render(<HomePageClient initialTeams={mockTeams} />);

    const genButton = screen.getByTestId('team-2');
    fireEvent.click(genButton);

    expect(mockPush).toHaveBeenCalledWith('/subscribe/GEN');
  });

  it('should call router.back when back button is clicked', async () => {
    const navModule = await import('next/navigation');
    const mockBack = (navModule as any).__mockBack;

    render(<HomePageClient initialTeams={mockTeams} />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should render with empty teams list', () => {
    render(<HomePageClient initialTeams={[]} />);

    expect(screen.getByTestId('team-grid')).toBeInTheDocument();
    // Should not find any team buttons when list is empty
    expect(screen.queryByTestId('team-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('team-2')).not.toBeInTheDocument();
  });

  it('should handle large number of teams', () => {
    const manyTeams = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name_abbr: `TEAM${i + 1}`,
      name_prefix: `Team ${i + 1}`,
      name_suffix: null,
      created_at: '2024-01-01'
    }));

    render(<HomePageClient initialTeams={manyTeams} />);

    manyTeams.forEach((team) => {
      expect(screen.getByText(team.name_abbr)).toBeInTheDocument();
    });
  });

  it('should maintain team selection state', async () => {
    const navModule = await import('next/navigation');
    const mockPush = (navModule as any).__mockPush;

    render(<HomePageClient initialTeams={mockTeams} />);

    const t1Button = screen.getByTestId('team-1');
    fireEvent.click(t1Button);

    // After clicking, router.push should be called
    expect(mockPush).toHaveBeenCalled();
  });
});
