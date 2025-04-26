import api from '@utils/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchLeaderboards = createAsyncThunk('leaderboards/receive', async (_, { rejectWithValue }) => {
  try {
    const { leaderboards } = await api.getLeaderBoards();
    return leaderboards;
  } catch (error) {
    return rejectWithValue(error.info());
  }
});

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