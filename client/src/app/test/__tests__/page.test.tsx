import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import TestPage from '../page';

// Mock RuneImages
vi.mock('@/shared/ui/RuneImages', () => ({
  default: ({ runePaths }: any) => (
    <div data-testid="rune-images">
      {runePaths.map((id: number) => (
        <img key={id} src={`/rune-${id}.png`} alt={`Rune ${id}`} />
      ))}
    </div>
  )
}));

// Mock SpellImages
vi.mock('@/shared/ui/SpellImages', () => ({
  default: ({ spellIds }: any) => (
    <div data-testid="spell-images">
      {spellIds.map((id: number) => (
        <img key={id} src={`/spell-${id}.png`} alt={`Spell ${id}`} />
      ))}
    </div>
  )
}));

describe('TestPage', () => {
  it('should render test page title', () => {
    render(<TestPage />);

    expect(screen.getByText('룬 이미지 테스트')).toBeInTheDocument();
  });

  it('should render sub rune styles section', () => {
    render(<TestPage />);

    expect(
      screen.getByText('🌀 Sub Rune Styles (부룬 스타일)')
    ).toBeInTheDocument();
  });

  it('should render rune images components', () => {
    render(<TestPage />);

    const runeImages = screen.getAllByTestId('rune-images');
    expect(runeImages.length).toBeGreaterThan(0);
  });

  it('should render keystone runes', () => {
    const { container } = render(<TestPage />);

    // Should render images for keystone runes (8005, 8008, etc.)
    const images = container.querySelectorAll('img[alt*="Rune"]');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should render sub style runes', () => {
    const { container } = render(<TestPage />);

    // Should render images for sub style runes (8000, 8100, etc.)
    const images = container.querySelectorAll('img[alt*="Rune"]');

    // Check if precision rune (8000) is rendered
    const precisionRune = Array.from(images).find((img) =>
      img.getAttribute('src')?.includes('8000')
    );
    expect(precisionRune).toBeTruthy();
  });

  it('should have proper layout structure', () => {
    const { container } = render(<TestPage />);

    const mainDiv = container.querySelector('.p-4.space-y-6');
    expect(mainDiv).toBeInTheDocument();
  });

  it('should render multiple rune sections', () => {
    render(<TestPage />);

    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements.length).toBe(2); // Two sections
  });
});
