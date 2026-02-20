import { cn } from './utils';

/**
 * Standard focus ring styles for keyboard navigation
 * Applies coral-colored outline with offset for WCAG compliance
 */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2';

/**
 * Base interactive element styles
 * Applies smooth transitions and cursor pointer
 */
export const INTERACTIVE_BASE = 'transition-all duration-200 cursor-pointer';

/**
 * Active state for interactive elements
 * Applies subtle scale-down effect on click
 */
export const INTERACTIVE_ACTIVE = 'active:scale-[0.98]';

/**
 * Primary button styles (CTA buttons)
 * Coral background with white text
 */
export const BUTTON_PRIMARY = cn(
  'px-6 py-3',
  'bg-coral text-white font-semibold',
  'rounded-lg',
  'hover:bg-coral-600',
  'active:bg-coral-700',
  FOCUS_RING,
  INTERACTIVE_BASE,
  INTERACTIVE_ACTIVE,
  'disabled:opacity-50 disabled:cursor-not-allowed'
);

/**
 * Secondary button styles
 * White background with coral text
 */
export const BUTTON_SECONDARY = cn(
  'px-6 py-3',
  'bg-white text-coral font-semibold',
  'border-2 border-coral',
  'rounded-lg',
  'hover:bg-coral-50',
  'active:bg-coral-100',
  FOCUS_RING,
  INTERACTIVE_BASE,
  INTERACTIVE_ACTIVE,
  'disabled:opacity-50 disabled:cursor-not-allowed'
);

/**
 * Ghost button styles (minimal design)
 * Transparent with hover effect
 */
export const BUTTON_GHOST = cn(
  'px-4 py-2',
  'bg-transparent text-navy',
  'rounded-lg',
  'hover:bg-gray-100',
  'active:bg-gray-200',
  FOCUS_RING,
  INTERACTIVE_BASE,
  'disabled:opacity-50 disabled:cursor-not-allowed'
);

/**
 * Base card styles
 * Applies white background, border, and shadow
 */
export const CARD_BASE = 'bg-white border border-gray-100 shadow-sm';

/**
 * Hover state for cards
 * Applies elevated shadow on hover
 */
export const CARD_HOVER = 'hover:shadow-md';

/**
 * Responsive card padding
 * Mobile (360px): 16px
 * Tablet (768px): 20px
 * Desktop (960px+): 24px
 */
export const CARD_PADDING = 'px-4 py-3 md:px-5 md:py-4 lg:px-6 lg:py-5';

/**
 * Legacy mobile card padding
 */
export const CARD_PADDING_MOBILE = 'px-4 py-3';

/**
 * Legacy desktop card padding
 */
export const CARD_PADDING_DESKTOP = 'md:px-6 md:py-4 lg:px-7 lg:py-5';

/**
 * Responsive card border radius
 * Mobile: 8px, Tablet: 12px, Desktop: 16px
 */
export const CARD_RADIUS = 'rounded-lg md:rounded-xl lg:rounded-2xl';

/**
 * Button padding for 44px touch target (WCAG AAA)
 * 10px padding to ensure minimum touch target size
 */
export const BUTTON_PADDING = 'p-2.5';

/**
 * Gets standardized card classes with responsive design
 * @param hoverable - Whether to include hover state
 * @returns Combined card class string
 */
export function getCardClasses(hoverable = true): string {
  return cn(
    CARD_BASE,
    CARD_PADDING,
    CARD_RADIUS,
    hoverable && CARD_HOVER
  );
}

/**
 * Responsive page padding
 * Mobile: 16px, Tablet: 24px, Desktop: 32px
 */
export const PAGE_PADDING = 'px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8';

/**
 * Responsive grid gap
 * Mobile: 12px, Tablet: 16px, Desktop: 24px
 */
export const GRID_GAP = 'gap-3 md:gap-4 lg:gap-6';

/**
 * Gets standardized interactive element classes
 * @param withFocus - Whether to include focus ring
 * @returns Combined interactive class string
 */
export function getInteractiveClasses(withFocus = true): string {
  return cn(INTERACTIVE_BASE, INTERACTIVE_ACTIVE, withFocus && FOCUS_RING);
}
