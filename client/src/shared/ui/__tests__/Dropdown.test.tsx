import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dropdown from '../dropdown';

// Mock hooks
vi.mock('@/shared/hooks/useAuth', () => ({
  useIsLoggedIn: vi.fn(),
  useUserId: vi.fn()
}));

vi.mock('@/shared/hooks/useToast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() }))
}));

vi.mock('@/shared/hooks/useOutsideClick', () => ({
  default: vi.fn()
}));

// Mock Supabase actions
vi.mock('@/shared/lib/supabase/actions', () => ({
  signOut: vi.fn()
}));

// Mock Redux
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(() => vi.fn())
}));

vi.mock('@/shared/store/authSlice', () => ({
  storeLogout: vi.fn()
}));

// Mock Firebase
vi.mock('@/shared/lib/firebase', () => ({
  requestToken: vi.fn()
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), back: vi.fn() }))
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

// Mock ConfirmDialog
vi.mock('../ConfirmDialog', () => ({
  ConfirmDialog: ({ isOpen, onClose, onConfirm, title }: any) =>
    isOpen ? (
      <div data-testid="confirm-dialog">
        <h3>{title}</h3>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null
}));

// Mock ThemeContext
const mockSetTheme = vi.fn();
vi.mock('@/shared/contexts/ThemeContext', () => ({
  useTheme: vi.fn(() => ({
    theme: 'dark',
    setTheme: mockSetTheme
  })),
  ThemeType: {}
}));

describe('Dropdown', () => {
  const mockToast = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    (useIsLoggedIn as any).mockReturnValue(false);
    (useUserId as any).mockReturnValue(null);

    const { useToast } = await import('@/shared/hooks/useToast');
    (useToast as any).mockReturnValue({ toast: mockToast });

    // Reset window location mock
    delete (window as any).location;
    (window as any).location = { href: '' };

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      bottom: 100,
      right: 200,
      top: 0,
      left: 0,
      width: 100,
      height: 50,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));
  });

  it('should render menu toggle button', () => {
    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    expect(button).toBeInTheDocument();
  });

  it('should open menu when button is clicked', () => {
    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(button);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });

  it('should close menu when button is clicked again', () => {
    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });

    // Open menu
    fireEvent.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Close menu
    fireEvent.click(button);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should show login menu item when user is not logged in', async () => {
    const { useIsLoggedIn } = await import('@/shared/hooks/useAuth');
    (useIsLoggedIn as any).mockReturnValue(false);

    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(button);

    expect(screen.getByText('로그인')).toBeInTheDocument();
    expect(screen.queryByText('마이페이지')).not.toBeInTheDocument();
    expect(screen.queryByText('로그아웃')).not.toBeInTheDocument();
  });

  it('should show user menu items when logged in', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(button);

    expect(screen.getByText('마이페이지')).toBeInTheDocument();
    expect(screen.getByText('로그아웃')).toBeInTheDocument();
    expect(screen.getByText('알림 재설정')).toBeInTheDocument();
    expect(screen.queryByText('로그인')).not.toBeInTheDocument();
  });

  it('should always show common menu items', () => {
    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(button);

    expect(screen.getByText('메인 화면')).toBeInTheDocument();
    expect(screen.getByText('도움말')).toBeInTheDocument();
  });

  it('should handle logout when logout button is clicked', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { signOut } = await import('@/shared/lib/supabase/actions');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(button);

    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      description: '로그아웃 되었습니다.'
    });
    expect(window.location.href).toBe('/');
  });

  it('should handle theme change', async () => {
    const { useIsLoggedIn } = await import('@/shared/hooks/useAuth');
    (useIsLoggedIn as any).mockReturnValue(false);

    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(button);

    const whiteThemeButton = screen.getByRole('button', { name: 'white 테마 선택' });
    fireEvent.click(whiteThemeButton);

    expect(mockSetTheme).toHaveBeenCalledWith('white');
    expect(mockToast).toHaveBeenCalledWith({
      description: 'White 테마로 변경되었습니다.'
    });
  });

  it('should render all theme options', () => {
    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: 'dark 테마 선택' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'white 테마 선택' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'blue 테마 선택' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'pink 테마 선택' })).toBeInTheDocument();
  });

  it('should show notification reset dialog when button is clicked', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    render(<Dropdown />);

    const menuButton = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(menuButton);

    const resetButton = screen.getByRole('menuitem', { name: /알림 재설정/i });
    fireEvent.click(resetButton);

    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
  });

  it('should handle notification reset confirmation', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { requestToken } = await import('@/shared/lib/firebase');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue('user-123');

    render(<Dropdown />);

    const menuButton = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(menuButton);

    const resetButton = screen.getByText('알림 재설정');
    fireEvent.click(resetButton);

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(requestToken).toHaveBeenCalledWith('user-123', true);
  });

  it('should have correct ARIA attributes on menu button', () => {
    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });

    expect(button).toHaveAttribute('aria-label', '메뉴');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('should update ARIA expanded when menu is open', () => {
    render(<Dropdown />);

    const button = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should open with isOpen prop', () => {
    render(<Dropdown isOpen={true} />);

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
