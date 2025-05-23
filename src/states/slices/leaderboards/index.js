import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  data: [],
};
const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {
    setLeaderboards: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { setLeaderboards } = leaderboardsSlice.actions;
export default leaderboardsSlice.reducer;