import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  user: null,
};

const authUserSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuthUser: (state) => {
      state.user = null;
    }
  }
});

export const { setAuthUser, clearAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
