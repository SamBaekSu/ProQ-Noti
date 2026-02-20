import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ConfirmDialog } from '../ConfirmDialog';

// Mock a11y utilities
vi.mock('@/shared/lib/a11y', () => ({
  useFocusTrap: vi.fn()
}));

describe('ConfirmDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Delete"
        message="Are you sure?"
      />
    );

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  });

  it('should render message', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="This action cannot be undone"
      />
    );

    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const cancelButton = screen.getByText('취소');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm and onClose when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const confirmButton = screen.getByText('확인');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render custom confirm text', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
        confirmText="Delete"
      />
    );

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render custom cancel text', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
        cancelText="No"
      />
    );

    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when dialog content is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const message = screen.getByText('Are you sure?');
    fireEvent.click(message);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const closeButton = screen.getByLabelText('닫기');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should apply default variant styles', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
        variant="default"
      />
    );

    const confirmButton = screen.getByText('확인');
    expect(confirmButton).toHaveClass('bg-mint/20', 'border-mint', 'text-mint');
  });

  it('should apply danger variant styles', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
        variant="danger"
      />
    );

    const confirmButton = screen.getByText('확인');
    expect(confirmButton).toHaveClass('bg-red-500/20', 'border-red-500', 'text-red-400');
  });

  it('should have role="dialog"', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should have aria-modal="true"', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should have aria-labelledby pointing to title', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Are you sure?"
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');

    const title = screen.getByText('Test Title');
    expect(title).toHaveAttribute('id', 'dialog-title');
  });

  it('should call useFocusTrap with dialog ref and isOpen', async () => {
    const { useFocusTrap } = await import('@/shared/lib/a11y');

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    expect(useFocusTrap).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(HTMLDivElement) }),
      true
    );
  });

  it('should cleanup event listeners when unmounted', () => {
    const { unmount } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should use default variant when not specified', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    const confirmButton = screen.getByText('확인');
    expect(confirmButton).toHaveClass('bg-mint/20', 'border-mint', 'text-mint');
  });

  it('should use default button text when not specified', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test"
        message="Are you sure?"
      />
    );

    expect(screen.getByText('확인')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
  });
});
