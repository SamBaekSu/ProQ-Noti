import { RootState } from './store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  email: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userId: null,
  email: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storeLogin: (
      state,
      actions: PayloadAction<{ userId: string; email: string | null }>
    ) => {
      state.isLoggedIn = true;
      state.userId = actions.payload.userId;
      state.email = actions.payload.email;
    },
    storeLogout: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
      state.email = null;
    }
  }
});

export const { storeLogin, storeLogout } = authSlice.actions;

export default authSlice.reducer;

export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const rUserId = (state: RootState) => state.auth.userId;
