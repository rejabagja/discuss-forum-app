import { createSlice } from '@reduxjs/toolkit';
import { preloadProcess } from '@states/thunks';


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