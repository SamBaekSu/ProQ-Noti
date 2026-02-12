import { render, waitFor } from '@testing-library/react';
import HomePageClient from '@/app/HomePageClient';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getToken } from 'firebase/messaging';

// Mock dependencies
vi.mock('@/actions/fcm', () => ({
  upsertFcmToken: vi.fn(() => Promise.resolve({ status: 'success' }))
}));

vi.mock('@/shared/lib/device', () => ({
  getDeviceType: vi.fn(() => 'web')
}));

vi.mock('@/shared/hooks/useAuth', () => ({
  useIsLoggedIn: vi.fn(),
  useUserId: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn()
  })
}));

// Mock Layout component
vi.mock('@/shared/ui/Layout', () => ({
  Layout: Object.assign(({ children }: any) => <div>{children}</div>, {
    Header: () => <div>Header</div>,
    Main: ({ children }: any) => <div>{children}</div>
  })
}));

vi.mock('@/shared/ui/TeamGrid', () => ({
  TeamGrid: () => <div>TeamGrid</div>
}));

describe('FCM Token Logic in HomePageClient', () => {
  const mockToken = 'test-fcm-token';
  const mockUserId = 'test-user-id';

  beforeEach(async () => {
    vi.clearAllMocks();

    // Import mocked modules
    const { upsertFcmToken } = await import('@/actions/fcm');
    const { getDeviceType } = await import('@/shared/lib/device');
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');

    (useIsLoggedIn as any).mockReturnValue(true);
    (useUserId as any).mockReturnValue(mockUserId);
    (getToken as any).mockResolvedValue(mockToken);
    (getDeviceType as any).mockReturnValue('web');

    // Default permission
    Object.defineProperty(global.Notification, 'permission', {
      value: 'granted',
      writable: true
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should register token when logged in and permission is granted', async () => {
    const { upsertFcmToken } = await import('@/actions/fcm');

    localStorage.removeItem('sentFCMToken');

    render(<HomePageClient initialTeams={[]} />);

    await waitFor(() => {
      expect(getToken).toHaveBeenCalled();
      expect(upsertFcmToken).toHaveBeenCalledWith(mockUserId, mockToken, 'web');
      expect(localStorage.getItem('sentFCMToken')).toBe(mockToken);
    });
  });

  it('should NOT register token if not logged in', async () => {
    const { useIsLoggedIn, useUserId } = await import('@/shared/hooks/useAuth');
    const { upsertFcmToken } = await import('@/actions/fcm');

    (useIsLoggedIn as any).mockReturnValue(false);
    (useUserId as any).mockReturnValue(null);

    render(<HomePageClient initialTeams={[]} />);

    await waitFor(() => {
      expect(getToken).not.toHaveBeenCalled();
      expect(upsertFcmToken).not.toHaveBeenCalled();
    });
  });

  it('should request permission if default', async () => {
    const { upsertFcmToken } = await import('@/actions/fcm');

    Object.defineProperty(global.Notification, 'permission', {
      value: 'default',
      writable: true
    });

    global.Notification.requestPermission = vi.fn().mockResolvedValue('granted');

    render(<HomePageClient initialTeams={[]} />);

    await waitFor(() => {
      expect(global.Notification.requestPermission).toHaveBeenCalled();
      expect(getToken).toHaveBeenCalled();
      expect(upsertFcmToken).toHaveBeenCalledWith(mockUserId, mockToken, 'web');
    });
  });

  it('should NOT register if token matches localStorage', async () => {
    const { upsertFcmToken } = await import('@/actions/fcm');

    localStorage.setItem('sentFCMToken', mockToken);

    render(<HomePageClient initialTeams={[]} />);

    await waitFor(() => {
      expect(getToken).toHaveBeenCalled();
      expect(upsertFcmToken).not.toHaveBeenCalled();
    });
  });
});
