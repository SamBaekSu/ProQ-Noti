import { createSlice } from '@reduxjs/toolkit';

const tokenSlices = createSlice({
  name: 'token',
  initialState: { tokenList: {}, tokenSet: {} },
  reducers: {
    setTokenList: (state, action) => {
      state.tokenList = action.payload;
    },
    setTokenDataset: (state, action) => {
      state.tokenSet = action.payload;
    },
  },
});

export const { setTokenList, setTokenDataset } = tokenSlices.actions;
export default tokenSlices.reducer;