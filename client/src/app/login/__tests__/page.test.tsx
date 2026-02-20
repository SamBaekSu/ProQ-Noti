import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LoginPage from '../page';

// Mock actions
vi.mock('@/shared/lib/supabase/actions', () => ({
  signInWithKakao: vi.fn(),
  signInWithGoogle: vi.fn()
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login page with title', () => {
    render(<LoginPage />);

    expect(screen.getByText('로그인')).toBeInTheDocument();
  });

  it('should render kakao login button', () => {
    render(<LoginPage />);

    const kakaoButton = screen.getByLabelText('카카오 로그인');
    expect(kakaoButton).toBeInTheDocument();
    expect(kakaoButton).toHaveTextContent('카카오 로그인');
  });

  it('should render google login button', () => {
    render(<LoginPage />);

    const googleButton = screen.getByLabelText('구글 로그인');
    expect(googleButton).toBeInTheDocument();
    expect(googleButton).toHaveTextContent('구글 로그인');
  });

  it('should call signInWithKakao when kakao button is clicked', async () => {
    const actions = await import('@/shared/lib/supabase/actions');
    const mockSignInWithKakao = vi.fn();
    (actions.signInWithKakao as any) = mockSignInWithKakao;

    render(<LoginPage />);

    const kakaoButton = screen.getByLabelText('카카오 로그인');
    fireEvent.click(kakaoButton);

    expect(mockSignInWithKakao).toHaveBeenCalledTimes(1);
  });

  it('should call signInWithGoogle when google button is clicked', async () => {
    const actions = await import('@/shared/lib/supabase/actions');
    const mockSignInWithGoogle = vi.fn();
    (actions.signInWithGoogle as any) = mockSignInWithGoogle;

    render(<LoginPage />);

    const googleButton = screen.getByLabelText('구글 로그인');
    fireEvent.click(googleButton);

    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('should call router.back when back button is clicked', async () => {
    const navModule = await import('next/navigation');
    const mockBack = (navModule as any).__mockBack;

    render(<LoginPage />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should have proper button styles', () => {
    render(<LoginPage />);

    const kakaoButton = screen.getByLabelText('카카오 로그인');
    const googleButton = screen.getByLabelText('구글 로그인');

    // Kakao button should have yellow background
    expect(kakaoButton).toHaveClass('bg-yellow-500');

    // Google button should have dark card background (dark theme)
    expect(googleButton).toHaveClass('bg-dark-card');
  });
});
