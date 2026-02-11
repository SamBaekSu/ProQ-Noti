import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose
}: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    if (confirmText !== '회원탈퇴') {
      toast({
        description: '확인 문구를 정확히 입력해주세요.'
      });
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          description: '회원탈퇴가 완료되었습니다.'
        });
        // 홈페이지로 리다이렉트
        router.push('/');
      } else {
        throw new Error(data.error || '회원탈퇴에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원탈퇴 오류:', error);
      toast({
        description:
          error instanceof Error ? error.message : '회원탈퇴에 실패했습니다.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[20rem] web:w-[25rem] mx-4">
        <h2 className="text-xl font-bold text-center mb-4">회원탈퇴</h2>

        <div className="mb-6">
          <p className="text-gray-700 mb-3">정말로 회원탈퇴를 하시겠습니까?</p>
          <p className="text-red-600 text-sm mb-4">
            ⚠️ 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              확인을 위해{' '}
              <span className="font-bold text-red-600">'회원탈퇴'</span>를
              입력해주세요:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="회원탈퇴"
              disabled={isDeleting}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting || confirmText !== '회원탈퇴'}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? '처리 중...' : '탈퇴하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
