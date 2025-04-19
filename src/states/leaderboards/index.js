import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/api';


export const receiveLeaderboards = createAsyncThunk('leaderboards/receive', async (_, { rejectWithValue }) => {
  try {
    const { leaderboards } = await api.getLeaderBoards();
    return leaderboards;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    leaderboards: [],
    error: null
  },
  extraReducers: (builder) => {
    builder.addCase(receiveLeaderboards.fulfilled, (state, action) => {
      state.error = null;
      state.leaderboards = action.payload;
    });
    builder.addCase(receiveLeaderboards.rejected, (state, action) => {
      state.error = action.payload;
    });
  }
});

export default leaderboardsSlice.reducer;