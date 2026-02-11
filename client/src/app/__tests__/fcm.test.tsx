import { render, waitFor } from '@testing-library/react';
import HomePageClient from '@/app/HomePageClient';
import { upsertFcmToken } from '@/actions/fcm';
import { getDeviceType } from '@/utils/device';
import { useIsLoggedIn, useUserId } from '@/hooks/useAuth';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getToken } from 'firebase/messaging';

// Mock dependencies
vi.mock('@/actions/fcm', () => ({
  upsertFcmToken: vi.fn(() => Promise.resolve({ status: 'success' }))
}));

vi.mock('@/utils/device', () => ({
  getDeviceType: vi.fn(() => 'web')
}));

vi.mock('@/hooks/useAuth', () => ({
  useIsLoggedIn: vi.fn(),
  useUserId: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn()
  })
}));

// Mock components to avoid rendering complexity
vi.mock('@/components/Layout', () => ({
  Layout: ({ children }: any) => <div>{children}</div>
}));
// Fix for Layout compound component
// @ts-ignore
vi.mock('@/components/Layout', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    Layout: Object.assign(({ children }: any) => <div>{children}</div>, {
      Header: () => <div>Header</div>,
      Main: ({ children }: any) => <div>{children}</div>
    })
  };
});

vi.mock('@/components/TeamGrid', () => ({
  TeamGrid: () => <div>TeamGrid</div>
}));

describe('FCM Token Logic in HomePageClient', () => {
  const mockToken = 'test-fcm-token';
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    vi.clearAllMocks();
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
    // Setup: no token in local storage
    localStorage.removeItem('sentFCMToken');

    render(<HomePageClient initialTeams={[]} />);

    await waitFor(() => {
      expect(getToken).toHaveBeenCalled();
      expect(upsertFcmToken).toHaveBeenCalledWith(mockUserId, mockToken, 'web');
      expect(localStorage.getItem('sentFCMToken')).toBe(mockToken);
    });
  });

  it('should NOT register token if not logged in', async () => {
    (useIsLoggedIn as any).mockReturnValue(false);
    (useUserId as any).mockReturnValue(null);

    render(<HomePageClient initialTeams={[]} />);

    await waitFor(() => {
      // Should not call getToken or upsertFcmToken
      expect(getToken).not.toHaveBeenCalled();
      expect(upsertFcmToken).not.toHaveBeenCalled();
    });
  });

  it('should request permission if default', async () => {
    Object.defineProperty(global.Notification, 'permission', {
      value: 'default',
      writable: true
    });
    const requestPermissionSpy = vi.spyOn(global.Notification, 'requestPermission').mockResolvedValue('granted');

    // We mock Notification.requestPermission in setup.ts but here we want to spy/mock specific return
    global.Notification.requestPermission = vi.fn().mockResolvedValue('granted');

    render(<HomePageClient initialTeams={[]} />);

    await waitFor(() => {
      expect(global.Notification.requestPermission).toHaveBeenCalled();
      expect(getToken).toHaveBeenCalled();
      expect(upsertFcmToken).toHaveBeenCalledWith(mockUserId, mockToken, 'web');
    });
  });

  it('should NOT register if token matches localStorage', async () => {
    localStorage.setItem('sentFCMToken', mockToken);

    render(<HomePageClient initialTeams={[]} />);

    await waitFor(() => {
      expect(getToken).toHaveBeenCalled();
      // upsertFcmToken should NOT be called because token in localStorage matches current token
      expect(upsertFcmToken).not.toHaveBeenCalled();
    });
  });
});
