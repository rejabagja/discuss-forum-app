import { createSlice } from '@reduxjs/toolkit';
import { fetchLeaderboards } from '@states/thunks';


const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    data: [],
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default leaderboardsSlice.reducer;