import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Notification API
if (!global.Notification) {
  global.Notification = {
    requestPermission: vi.fn(),
    permission: 'default'
  } as any;
}

// Mock Firebase Messaging
vi.mock('firebase/messaging', () => ({
  getMessaging: vi.fn(() => ({})),
  getToken: vi.fn()
}));

// Mock Supabase
vi.mock('@/shared/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({ error: null }))
    }))
  }
}));
