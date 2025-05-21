import { createSlice } from '@reduxjs/toolkit';


const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    data: [],
  },
  reducers: {
    setLeaderboards: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { setLeaderboards } = leaderboardsSlice.actions;
export default leaderboardsSlice.reducer;