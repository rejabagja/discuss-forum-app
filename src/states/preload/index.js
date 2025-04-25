import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/api';
import { setAuthUser } from '../auth-user';


export const preloadProcess = createAsyncThunk(
  'preload/preloadProcess',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { user } = await api.getOwnProfile();
      dispatch(setAuthUser(user));
      return true;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || 'failed to load app.');
    }
  });

const preloadSlice = createSlice({
  name: 'preload',
  initialState: {
    isLoading: true,
    error: null
  },
  extraReducers:(builder) => {
    builder
      .addCase(preloadProcess.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(preloadProcess.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(preloadProcess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default preloadSlice.reducer;