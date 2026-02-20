import { isLoggedIn, rUserId } from '@/shared/store/authSlice';
import { useSelector } from 'react-redux';

export function useUserId() {
  return useSelector(rUserId);
}

export function useIsLoggedIn() {
  return useSelector(isLoggedIn);
}
