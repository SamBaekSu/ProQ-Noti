# Z-Index Hierarchy

ProQ-Noti uses a systematic z-index layering defined in `src/app/globals.css` to ensure proper element stacking throughout the application.

## Z-Index System

All z-index values are defined as CSS variables in the design system and should be referenced consistently across components.

### Layer Hierarchy

| Layer | CSS Variable | Value | Usage | Component Examples |
|-------|-------------|-------|-------|-------------------|
| **Base** | `--z-base` | `0` | Normal document flow | Most content |
| **Hide** | `--z-hide` | `-1` | Hidden elements | Background decorations |
| **Sticky** | `--z-sticky` | `20` | Sticky positioned elements | Layout Header |
| **Fixed** | `--z-fixed` | `30` | Fixed positioned elements | - |
| **Dropdown** | `--z-dropdown` | `40` | Dropdown menus | Navigation Dropdown |
| **Modal Backdrop** | `--z-modal-backdrop` | `50` | Modal/dialog backdrops | Modal, ConfirmDialog |
| **Modal** | `--z-modal` | `60` | Modal/dialog content | Modal, ConfirmDialog |
| **Popover** | `--z-popover` | `70` | Popover elements | - |
| **Tooltip** | `--z-tooltip` | `75` | Tooltip overlays | - |
| **Notification** | `--z-notification` | `80` | Toast notifications | Toaster (highest layer) |

## Implementation Guidelines

### Using Z-Index in Components

#### In Tailwind Classes
```tsx
// Use the predefined Tailwind utility classes
<div className="z-sticky">Sticky Header</div>
<div className="z-modal-backdrop">Modal Backdrop</div>
<div className="z-notification">Toast</div>
```

#### In Inline Styles
```tsx
// Use numeric values that match the CSS variables
<div style={{ zIndex: 40 }}>Dropdown Menu</div>
<div style={{ zIndex: 80 }}>Notification</div>
```

**Important:** Do NOT use arbitrary values like `z-[9999]` or `zIndex: 99999`. Always use the predefined system values.

## Component-Specific Implementation

### Layout Header (`src/shared/ui/Layout.tsx`)
```tsx
// Uses z-sticky (20) to stay above normal content
<header className="sticky top-0 z-sticky">
  {/* Header content */}
</header>
```

### Dropdown (`src/shared/ui/dropdown.tsx`)
```tsx
// Uses numeric 40 (matches --z-dropdown)
<div style={{ zIndex: 40 }}>
  {/* Dropdown menu */}
</div>
```

### Modal & ConfirmDialog (`src/shared/ui/Modal.tsx`, `src/shared/ui/ConfirmDialog.tsx`)
```tsx
// Backdrop uses z-modal-backdrop (50)
<div className="z-modal-backdrop">
  {/* Content uses z-modal (60) in child */}
</div>
```

### Toaster (`src/shared/ui/ui/toaster.tsx`)
```tsx
// Uses z-notification (80) - highest layer
<ToastViewport className="z-notification" />
```

## Testing Z-Index Layers

Manual testing checklist:
- [ ] Header stays visible when scrolling
- [ ] Dropdown appears above page content
- [ ] Modal backdrop covers dropdown
- [ ] Modal content appears above backdrop
- [ ] Toast notifications appear above everything

## Migration Notes

### Before Cleanup (v1.0.0)
```tsx
// ❌ Hardcoded arbitrary values
<div style={{ zIndex: 99999 }}>Dropdown</div>
<ToastViewport className="z-[9999]" />
```

### After Cleanup (v1.1.0)
```tsx
// ✅ System values
<div style={{ zIndex: 40 }}>Dropdown</div>
<ToastViewport className="z-notification" />
```

## Common Pitfalls

### ❌ Don't Do This
```tsx
// Arbitrary high values
<div style={{ zIndex: 9999 }}>Menu</div>
<div className="z-[99999]">Toast</div>

// String values in inline styles (won't work)
<div style={{ zIndex: 'var(--z-dropdown)' }}>Menu</div>
```

### ✅ Do This
```tsx
// Use system values
<div style={{ zIndex: 40 }}>Menu</div>
<div className="z-notification">Toast</div>

// Or use Tailwind classes when possible
<div className="z-dropdown">Menu</div>
```

## References

- **CSS Variables Definition**: `src/app/globals.css` (lines 282-291)
- **Tailwind Config**: TailwindCSS 4 automatically generates utilities from CSS variables
- **Design System**: All values follow the ProQ-Noti gaming aesthetic

## Version History

- **v1.1.0** (2026-02-16): Standardized z-index system, removed arbitrary values
- **v1.0.0**: Initial implementation with mixed z-index approaches
