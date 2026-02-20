import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Modal } from '../Modal';

// Mock a11y utilities
vi.mock('@/shared/lib/a11y', () => ({
  useFocusTrap: vi.fn()
}));

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
        <button>Action</button>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('닫기');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not show close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test" showCloseButton={false}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByLabelText('닫기')).not.toBeInTheDocument();
  });

  it('should call onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose on Escape when closeOnEscape is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnEscape={false}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when backdrop is clicked and closeOnBackdrop is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnBackdrop={false}>
        <div>Content</div>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should not close when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const content = screen.getByText('Content');
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should apply sm size class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="sm">
        <div>Content</div>
      </Modal>
    );

    const modalContent = container.querySelector('.max-w-sm');
    expect(modalContent).toBeInTheDocument();
  });

  it('should apply md size class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="md">
        <div>Content</div>
      </Modal>
    );

    const modalContent = container.querySelector('.max-w-md');
    expect(modalContent).toBeInTheDocument();
  });

  it('should apply lg size class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="lg">
        <div>Content</div>
      </Modal>
    );

    const modalContent = container.querySelector('.max-w-lg');
    expect(modalContent).toBeInTheDocument();
  });

  it('should have role="dialog"', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should have aria-modal="true"', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should have aria-labelledby when title is provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

    const title = screen.getByText('Test Title');
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  it('should not have aria-labelledby when title is not provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('should call useFocusTrap with modal ref and isOpen', async () => {
    const { useFocusTrap } = await import('@/shared/lib/a11y');

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    expect(useFocusTrap).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(HTMLDivElement) }),
      true
    );
  });

  it('should cleanup event listeners when unmounted', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should use md size by default', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const modalContent = container.querySelector('.max-w-md');
    expect(modalContent).toBeInTheDocument();
  });
});
