import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/api';


export const preloadProcess = createAsyncThunk(
  'preload/process',
  async () => {
    try {
      const { user } = await api.getOwnProfile();
      return user;
    } catch (error) {
      console.error(error.message);
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