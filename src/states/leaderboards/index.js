import api from '@utils/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';


export const fetchLeaderboards = createAsyncThunk('leaderboards/receive', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showLoading());
    const { leaderboards } = await api.getLeaderBoards();
    return leaderboards;
  } catch (error) {
    return rejectWithValue(error);
  } finally {
    dispatch(hideLoading());
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
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default leaderboardsSlice.reducer;