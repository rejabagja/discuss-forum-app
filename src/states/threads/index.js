import api from '@utils/api';
import { setCategories } from '@states/categories';
import { clearError as clearThreadsError } from '@states/threads';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { upVote as upVoteSync, downVote as downVoteSync, neutralVote as neutralVoteSync } from '@states/threads';


export const fetchThreads = createAsyncThunk('threads/fetchThreads', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(clearThreadsError());
    const { threads } = await api.getThreads();

    const uniqueCategories = [...new Set(threads.map((thread) => thread.category))];
    dispatch(setCategories(uniqueCategories));

    return threads;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const upVoteThreads = createAsyncThunk('threads/upVoteThreads', async ({ threadId, userId }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(upVoteSync({ threadId, userId }));
    await api.setVoteThread(threadId, api.VoteType.UP_VOTE);
  } catch (error) {
    dispatch(upVoteSync({ threadId, userId }));
    return rejectWithValue(error);
  }
});
export const downVoteThreads = createAsyncThunk('threads/downVoteThreads', async ({ threadId, userId }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(downVoteSync({ threadId, userId }));
    await api.setVoteThread(threadId, api.VoteType.DOWN_VOTE);
  } catch (error) {
    dispatch(downVoteSync({ threadId, userId }));
    return rejectWithValue(error);
  }
});
export const neutralVoteThreads = createAsyncThunk('threads/neutralVoteThreads', async ({ threadId, userId }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(neutralVoteSync({ threadId, userId }));
    await api.setVoteThread(threadId, api.VoteType.NEUTRAL_VOTE);
  } catch (error) {
    dispatch(neutralVoteSync({ threadId, userId }));
    return rejectWithValue(error);
  }
});

export const addThread = createAsyncThunk('threads/add', async (newThread, { rejectWithValue, dispatch }) => {
  try {
    dispatch(clearThreadsError());
    const { thread } = await api.createThread(newThread);
    return thread;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    data: [],
    error: null,
    isLoading: false,
    isCreated: false,
  },
  reducers: {
    upVote: (state, action) => {
      const { threadId, userId } = action.payload;
      state.data = state.data.map((thread) => {
        if (thread.id === threadId && !thread.upVotesBy.includes(userId)) {
          return {
            ...thread,
            downVotesBy: thread.downVotesBy.filter((id) => id !== userId),
            upVotesBy: [...thread.upVotesBy, userId],
          };
        }
        return thread;
      });
    },
    downVote: (state, action) => {
      const { threadId, userId } = action.payload;
      state.data = state.data.map((thread) => {
        if (thread.id === threadId && !thread.downVotesBy.includes(userId)) {
          return {
            ...thread,
            upVotesBy: thread.upVotesBy.filter((id) => id !== userId),
            downVotesBy: [...thread.downVotesBy, userId],
          };
        }
        return thread;
      });
    },
    neutralVote: (state, action) => {
      const { threadId, userId } = action.payload;
      state.data = state.data.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            upVotesBy: thread.upVotesBy.filter((id) => id !== userId),
            downVotesBy: thread.downVotesBy.filter((id) => id !== userId),
          };
        }
        return thread;
      });
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCreatedStatus: (state) => {
      state.isCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(addThread.pending, (state) => {
        state.isLoading = true;
        state.isCreated = false;
      })
      .addCase(addThread.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = [action.payload, ...state.data];
        state.isCreated = true;
      })
      .addCase(addThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isCreated = false;
      });
  },
});

export const { upVote, downVote, neutralVote, clearError, resetCreatedStatus } = threadsSlice.actions;
export default threadsSlice.reducer;