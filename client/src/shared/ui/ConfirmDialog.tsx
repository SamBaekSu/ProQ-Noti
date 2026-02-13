'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { useFocusTrap } from '@/shared/lib/a11y';
import { FOCUS_RING } from '@/shared/lib/component-utils';
import { IoClose } from 'react-icons/io5';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default'
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="bg-dark-card border-2 border-dark-border p-6 sm:p-8 w-[20rem] sm:w-[28rem] mx-4 animate-scale-in shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-coral"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-coral"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-coral"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-coral"></div>

        <div className="flex items-center justify-between mb-4 relative z-10">
          <h2 id="dialog-title" className="text-xl font-black text-white uppercase tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'p-2 bg-dark-hover border border-dark-border hover:border-coral transition-all',
              FOCUS_RING
            )}
            aria-label="닫기"
          >
            <IoClose className="w-5 h-5 text-white" />
          </button>
        </div>

        <p className="text-base text-gray-300 mb-6 relative z-10 font-medium">{message}</p>

        <div className="flex gap-3 relative z-10">
          <button
            onClick={onClose}
            className={cn(
              'flex-1 px-5 py-3',
              'border-2 border-dark-border bg-dark-hover',
              'text-base text-gray-300 font-bold uppercase tracking-wide',
              'hover:border-gray-600 hover:text-white',
              'active:bg-dark-border',
              'transition-all duration-200'
            )}
          >
            {cancelText}
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              'flex-1 px-5 py-3',
              'border-2 text-base font-black uppercase tracking-wide',
              'transition-all duration-200',
              variant === 'danger'
                ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-mint/20 border-mint text-mint hover:bg-mint/30 hover:shadow-[0_0_15px_rgba(121,206,184,0.5)]'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
