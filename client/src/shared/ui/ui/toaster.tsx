'use client';

import { useToast } from '@/shared/hooks/useToast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/shared/ui/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport
        className="
        fixed
        top-16
        left-1/2
        -translate-x-1/2
        sm:left-auto
        sm:right-4
        sm:translate-x-0
        sm:top-16
        z-notification
        w-full
        px-4
      "
      />
    </ToastProvider>
  );
}
