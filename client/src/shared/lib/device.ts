export type DeviceType = 'mobile_web' | 'desktop_web';

export function getDeviceType(): DeviceType {
  if (typeof navigator === 'undefined') return 'desktop_web';
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? 'mobile_web'
    : 'desktop_web';
}
