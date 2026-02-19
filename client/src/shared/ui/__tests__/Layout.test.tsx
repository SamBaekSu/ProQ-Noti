import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Layout } from '../Layout';

// Mock router
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    back: mockBack,
    push: vi.fn()
  }))
}));

// Mock Dropdown
vi.mock('../dropdown', () => ({
  default: () => <div data-testid="dropdown">Dropdown</div>
}));

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Layout wrapper', () => {
    it('should render children', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Layout className="custom-class">
          <div>Content</div>
        </Layout>
      );

      const layout = container.firstChild;
      expect(layout).toHaveClass('custom-class');
    });
  });

  describe('Layout.Header', () => {
    it('should render title', () => {
      render(
        <Layout>
          <Layout.Header title="Test Title" />
        </Layout>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render back button when handleBack is provided', () => {
      const mockHandleBack = vi.fn();

      render(
        <Layout>
          <Layout.Header title="Test" handleBack={mockHandleBack} />
        </Layout>
      );

      const backButton = screen.getByLabelText('뒤로 가기');
      expect(backButton).toBeInTheDocument();
    });

    it('should not render back button when handleBack is not provided', () => {
      render(
        <Layout>
          <Layout.Header title="Test" />
        </Layout>
      );

      expect(screen.queryByLabelText('뒤로 가기')).not.toBeInTheDocument();
    });

    it('should call handleBack when back button is clicked', () => {
      const mockHandleBack = vi.fn();

      render(
        <Layout>
          <Layout.Header title="Test" handleBack={mockHandleBack} />
        </Layout>
      );

      const backButton = screen.getByLabelText('뒤로 가기');
      fireEvent.click(backButton);

      expect(mockHandleBack).toHaveBeenCalledTimes(1);
    });

    it('should render dropdown', () => {
      render(
        <Layout>
          <Layout.Header title="Test" />
        </Layout>
      );

      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });

    it('should render children instead of title when provided', () => {
      render(
        <Layout>
          <Layout.Header title="Should Not Appear">
            <div>Custom Content</div>
          </Layout.Header>
        </Layout>
      );

      expect(screen.getByText('Custom Content')).toBeInTheDocument();
      expect(screen.queryByText('Should Not Appear')).not.toBeInTheDocument();
    });

    it('should render option when provided', () => {
      render(
        <Layout>
          <Layout.Header title="Test" option={<button>Option</button>} />
        </Layout>
      );

      expect(screen.getByText('Option')).toBeInTheDocument();
    });
  });

  describe('Layout.Main', () => {
    it('should render children', () => {
      render(
        <Layout>
          <Layout.Main>
            <div>Main Content</div>
          </Layout.Main>
        </Layout>
      );

      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Layout>
          <Layout.Main className="custom-main-class">
            <div>Content</div>
          </Layout.Main>
        </Layout>
      );

      const main = container.querySelector('main');
      expect(main).toHaveClass('custom-main-class');
    });

    it('should render as main element', () => {
      render(
        <Layout>
          <Layout.Main>
            <div>Content</div>
          </Layout.Main>
        </Layout>
      );

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Layout.Footer', () => {
    it('should render children', () => {
      render(
        <Layout>
          <Layout.Footer>
            <div>Footer Content</div>
          </Layout.Footer>
        </Layout>
      );

      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Layout>
          <Layout.Footer className="custom-footer-class">
            <div>Content</div>
          </Layout.Footer>
        </Layout>
      );

      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('custom-footer-class');
    });

    it('should render as footer element', () => {
      render(
        <Layout>
          <Layout.Footer>
            <div>Content</div>
          </Layout.Footer>
        </Layout>
      );

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Compound component pattern', () => {
    it('should render full layout with all parts', () => {
      render(
        <Layout>
          <Layout.Header title="Header" />
          <Layout.Main>
            <div>Main</div>
          </Layout.Main>
          <Layout.Footer>
            <div>Footer</div>
          </Layout.Footer>
        </Layout>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Main')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('should work with partial layout', () => {
      render(
        <Layout>
          <Layout.Header title="Header" />
          <Layout.Main>
            <div>Main Only</div>
          </Layout.Main>
        </Layout>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Main Only')).toBeInTheDocument();
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    });
  });

  describe('Header sticky behavior', () => {
    it('should have sticky position class', () => {
      const { container } = render(
        <Layout>
          <Layout.Header title="Test" />
        </Layout>
      );

      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky', 'top-0');
    });

    it('should have correct z-index class', () => {
      const { container } = render(
        <Layout>
          <Layout.Header title="Test" />
        </Layout>
      );

      const header = container.querySelector('header');
      expect(header).toHaveClass('z-dropdown');
    });
  });
});
