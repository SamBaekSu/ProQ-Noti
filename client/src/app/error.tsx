'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming button component exists or will be created/used

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 text-center">
      <h2 className="text-2xl font-bold">무언가 잘못되었습니다!</h2>
      <p className="text-gray-500">잠시 후 다시 시도해주세요.</p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        다시 시도
      </Button>
    </div>
  );
}
