'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { useFocusTrap } from '@/shared/lib/a11y';
import { FOCUS_RING } from '@/shared/lib/component-utils';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
}

const SIZE_MAP = {
  sm: 'w-[20rem]',
  md: 'w-[25rem]',
  lg: 'w-[30rem]'
};

/**
 * Modal Component - Reusable modal base component
 * Features:
 * - Focus trap for accessibility
 * - ESC key support
 * - Backdrop click to close
 * - Configurable size
 * - Optional close button
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnEscape = true,
  closeOnBackdrop = true,
  showCloseButton = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-white rounded-2xl p-6 sm:p-8 mx-4 animate-scale-in shadow-2xl border-2 border-gray-200',
          SIZE_MAP[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-heading2 font-bold text-navy">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-lg hover:bg-gray-100 transition-colors',
                  FOCUS_RING
                )}
                aria-label="닫기"
              >
                <IoClose className="w-5 h-5 text-navy" />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
