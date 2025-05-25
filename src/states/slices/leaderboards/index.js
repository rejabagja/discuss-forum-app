import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  data: [],
};
const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {
    setLeaderboardsData: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { setLeaderboardsData } = leaderboardsSlice.actions;
export default leaderboardsSlice.reducer;