'use client';

import { useEffect } from 'react';

/**
 * Announces a state change to screen readers using an aria-live region
 * @param message - The message to announce to screen readers
 */
export function announceStateChange(message: string): void {
  // Create a temporary live region
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = message;

  // Add to DOM
  document.body.appendChild(liveRegion);

  // Remove after screen reader has announced (1 second)
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
}

/**
 * Traps focus within a container element (modal, dialog, etc.)
 * Implements keyboard navigation to prevent focus from escaping
 *
 * @param ref - Reference to the container element
 * @param isActive - Whether the focus trap is active
 */
export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;

    // Get all focusable elements within the container
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Handle Tab key to trap focus
    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        // Shift+Tab on first element -> go to last
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        // Tab on last element -> go to first
        e.preventDefault();
        firstElement.focus();
      }
    }

    // Add event listener
    element.addEventListener('keydown', handleTabKey);

    // Focus first element when trap activates
    firstElement?.focus();

    // Cleanup
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [ref, isActive]);
}
