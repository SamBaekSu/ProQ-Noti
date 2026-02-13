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

  const mockLivePlayers = [
    {
      id: 1,
      pro_name: 'Faker',
      team_abbr: 'T1',
      team_name: 'T1',
      summoner_name: 'Hide on bush',
      tag_line: 'KR1',
      puuid: 'puuid-123',
      is_online: true
    },
    {
      id: 2,
      pro_name: 'Chovy',
      team_abbr: 'GEN',
      team_name: 'Gen.G',
      summoner_name: 'GenG Chovy',
      tag_line: 'KR1',
      puuid: 'puuid-456',
      is_online: true
    }
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    (useIsLoggedIn as any).mockReturnValue(false);
    (useUserId as any).mockReturnValue(null);
  });

  it('should render home page with title', () => {
    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={[]} />);

    expect(screen.getByText('ProQ-Noti')).toBeInTheDocument();
  });

  it('should render team grid with teams', () => {
    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={[]} />);

    expect(screen.getByTestId('team-grid')).toBeInTheDocument();
    expect(screen.getByTestId('team-1')).toBeInTheDocument();
    expect(screen.getByTestId('team-2')).toBeInTheDocument();
  });

  it('should display team names', () => {
    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={[]} />);

    expect(screen.getByText('T1')).toBeInTheDocument();
    expect(screen.getByText('GEN')).toBeInTheDocument();
  });

  it('should navigate to team page when team is selected', async () => {
    const navModule = await import('next/navigation');
    const mockPush = (navModule as any).__mockPush;

    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={[]} />);

    const t1Button = screen.getByTestId('team-1');
    fireEvent.click(t1Button);

    expect(mockPush).toHaveBeenCalledWith('/subscribe/T1');
  });

  it('should navigate to correct team page for each team', async () => {
    const navModule = await import('next/navigation');
    const mockPush = (navModule as any).__mockPush;

    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={[]} />);

    const genButton = screen.getByTestId('team-2');
    fireEvent.click(genButton);

    expect(mockPush).toHaveBeenCalledWith('/subscribe/GEN');
  });

  it('should call router.back when back button is clicked', async () => {
    const navModule = await import('next/navigation');
    const mockBack = (navModule as any).__mockBack;

    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={[]} />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should render with empty teams list', () => {
    render(<HomePageClient initialTeams={[]} initialLivePlayers={[]} />);

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

    render(<HomePageClient initialTeams={manyTeams} initialLivePlayers={[]} />);

    manyTeams.forEach((team) => {
      expect(screen.getByText(team.name_abbr)).toBeInTheDocument();
    });
  });

  it('should maintain team selection state', async () => {
    const navModule = await import('next/navigation');
    const mockPush = (navModule as any).__mockPush;

    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={[]} />);

    const t1Button = screen.getByTestId('team-1');
    fireEvent.click(t1Button);

    // After clicking, router.push should be called
    expect(mockPush).toHaveBeenCalled();
  });

  it('should render live players section when players are online', () => {
    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={mockLivePlayers} />);

    expect(screen.getByText('Live Now')).toBeInTheDocument();
    expect(screen.getByText('2명의 프로게이머가 게임 중입니다')).toBeInTheDocument();
    expect(screen.getByText('Faker')).toBeInTheDocument();
    expect(screen.getByText('Chovy')).toBeInTheDocument();
  });

  it('should not render live players section when no players are online', () => {
    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={[]} />);

    expect(screen.queryByText('Live Now')).not.toBeInTheDocument();
    expect(screen.queryByText('명의 프로게이머가 게임 중입니다')).not.toBeInTheDocument();
  });

  it('should navigate to team page when live player card is clicked', async () => {
    const navModule = await import('next/navigation');
    const mockPush = (navModule as any).__mockPush;

    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={mockLivePlayers} />);

    const fakerCard = screen.getByText('Faker').closest('button');
    expect(fakerCard).toBeInTheDocument();

    if (fakerCard) {
      fireEvent.click(fakerCard);
      expect(mockPush).toHaveBeenCalledWith('/subscribe/T1');
    }
  });

  it('should display correct summoner info for live players', () => {
    render(<HomePageClient initialTeams={mockTeams} initialLivePlayers={mockLivePlayers} />);

    expect(screen.getByText('Hide on bush#KR1')).toBeInTheDocument();
    expect(screen.getByText('GenG Chovy#KR1')).toBeInTheDocument();
  });
});
