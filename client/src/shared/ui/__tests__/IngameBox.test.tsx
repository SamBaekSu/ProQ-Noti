import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import IngameBox from '../IngameBox';

// Mock hooks
vi.mock('@/shared/hooks/useAuth', () => ({
  useUserId: vi.fn()
}));

vi.mock('@/shared/hooks/useToast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() }))
}));

// Mock actions
vi.mock('@/actions/subscribe', () => ({
  toggleSubscription: vi.fn()
}));

// Mock components
vi.mock('../LiveIcon', () => ({
  LiveIcon: ({ className }: any) => <div className={className}>LIVE</div>
}));

vi.mock('../ChampionImage', () => ({
  default: ({ championId, size }: any) => (
    <div data-testid="champion-image" data-champion-id={championId} data-size={size}>
      Champion
    </div>
  )
}));

vi.mock('../SpellImages', () => ({
  default: ({ spellIds }: any) => <div data-testid="spell-images">Spells</div>
}));

vi.mock('../RuneImages', () => ({
  default: ({ runePaths }: any) => <div data-testid="rune-images">Runes</div>
}));

vi.mock('../GameAssetImage', () => ({
  GameAssetImage: ({ type, id, size, alt }: any) => (
    <div data-testid={`game-asset-${type}`} data-id={id} data-size={size}>
      {alt}
    </div>
  )
}));

vi.mock('@/shared/lib/a11y', () => ({
  announceStateChange: vi.fn()
}));

describe('IngameBox', () => {
  const mockToast = vi.fn();
  const mockOnBoxClick = vi.fn();

  const defaultProps = {
    pro_name: 'Faker',
    summoner_name: 'Hide on bush',
    tag_line: 'KR1',
    is_online: false,
    is_subscribed: false,
    isOpen: false,
    onBoxClick: mockOnBoxClick,
    loggedIn: false,
    puuid: 'test-puuid',
    id: '1',
    streamer_mode: false,
    last_match_id: null
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const { useUserId } = await import('@/shared/hooks/useAuth');
    (useUserId as any).mockReturnValue('user-123');

    const { useToast } = await import('@/shared/hooks/useToast');
    (useToast as any).mockReturnValue({ toast: mockToast });

    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ inGame: false })
      })
    ) as any;

    // Mock Notification API
    global.Notification = {
      permission: 'granted',
      requestPermission: vi.fn(() => Promise.resolve('granted'))
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render player name', () => {
    render(<IngameBox {...defaultProps} />);

    expect(screen.getByText('Faker')).toBeInTheDocument();
  });

  it('should render LIVE icon when player is online', () => {
    render(<IngameBox {...defaultProps} is_online={true} />);

    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('should not render LIVE icon when player is offline', () => {
    render(<IngameBox {...defaultProps} is_online={false} />);

    expect(screen.queryByText('LIVE')).not.toBeInTheDocument();
  });

  it('should show summoner name when expanded', () => {
    render(<IngameBox {...defaultProps} isOpen={true} />);

    expect(screen.getByText(/Hide on bush/)).toBeInTheDocument();
  });

  it('should not show summoner name when collapsed', () => {
    render(<IngameBox {...defaultProps} isOpen={false} />);

    const summonerNameElement = screen.queryByText(/Hide on bush#KR1/);
    expect(summonerNameElement).not.toBeInTheDocument();
  });

  it('should call onBoxClick when card is clicked', () => {
    render(<IngameBox {...defaultProps} />);

    const card = screen.getByRole('button', { name: 'Faker 게임 정보 확인' });
    fireEvent.click(card);

    expect(mockOnBoxClick).toHaveBeenCalledTimes(1);
  });

  it('should handle Enter key press', () => {
    render(<IngameBox {...defaultProps} />);

    const card = screen.getByRole('button', { name: 'Faker 게임 정보 확인' });
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(mockOnBoxClick).toHaveBeenCalledTimes(1);
  });

  it('should handle Space key press', () => {
    render(<IngameBox {...defaultProps} />);

    const card = screen.getByRole('button', { name: 'Faker 게임 정보 확인' });
    fireEvent.keyDown(card, { key: ' ' });

    expect(mockOnBoxClick).toHaveBeenCalledTimes(1);
  });

  it('should render subscribe button with unsubscribed state', () => {
    render(<IngameBox {...defaultProps} is_subscribed={false} />);

    const button = screen.getByRole('button', { name: '구독' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('should render subscribe button with subscribed state', () => {
    render(<IngameBox {...defaultProps} is_subscribed={true} />);

    const button = screen.getByRole('button', { name: '구독 해제' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('should show toast when subscribe clicked without login', async () => {
    render(<IngameBox {...defaultProps} loggedIn={false} />);

    const button = screen.getByRole('button', { name: '구독' });
    fireEvent.click(button);

    await waitFor(
      () => {
        expect(mockToast).toHaveBeenCalledWith({
          description: '로그인 후 구독 버튼을 눌러주세요!'
        });
      },
      { timeout: 1000 }
    );
  });

  it('should have correct ARIA attributes', () => {
    render(<IngameBox {...defaultProps} />);

    const card = screen.getByRole('button', { name: 'Faker 게임 정보 확인' });
    expect(card).toHaveAttribute('aria-expanded', 'false');
  });

  it('should update aria-expanded when opened', () => {
    render(<IngameBox {...defaultProps} isOpen={true} />);

    const card = screen.getByRole('button', { name: 'Faker 게임 정보 확인' });
    expect(card).toHaveAttribute('aria-expanded', 'true');
  });

  it('should prevent click from bubbling to parent container', () => {
    const parentClickHandler = vi.fn();

    const { container } = render(
      <div onClick={parentClickHandler}>
        <IngameBox {...defaultProps} loggedIn={true} is_subscribed={false} />
      </div>
    );

    const button = screen.getByRole('button', { name: '구독' });
    fireEvent.click(button);

    // Parent click handler should not be called due to stopPropagation
    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
