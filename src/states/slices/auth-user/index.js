import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  data: null,
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.data = action.payload;
    },
    clearAuthUser: (state) => {
      state.data = null;
    }
  }
});

export const { setAuthUser, clearAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
