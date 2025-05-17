import { createSlice } from '@reduxjs/toolkit';
import { login, preloadProcess } from '@states/thunks';


const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.data = action.payload;
    },
    clearAuthUser: () => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(preloadProcess.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { setAuthUser, clearAuthUser, clearError } = authUserSlice.actions;
export default authUserSlice.reducer;
