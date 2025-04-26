import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/api';
import { setAuthUser } from '../auth-user';


export const preloadProcess = createAsyncThunk(
  'preload/process',
  async (_, { dispatch }) => {
    try {
      const { user } = await api.getOwnProfile();
      dispatch(setAuthUser(user));
    } catch (error) {
      console.log(error.message);
    }
  });

const preloadSlice = createSlice({
  name: 'preload',
  initialState: true,
  extraReducers:(builder) => {
    builder
      .addCase(preloadProcess.pending, () => true)
      .addCase(preloadProcess.fulfilled, () => false)
      .addCase(preloadProcess.rejected, () => false);
  }
});

export default preloadSlice.reducer;