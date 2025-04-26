import api from '@utils/api';
import { setCategories } from '@states/categories';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { upVote as upVoteSync, downVote as downVoteSync, neutralVote as neutralVoteSync } from '@states/threads';


export const fetchThreads = createAsyncThunk('threads/fetchThreads', async (_, { rejectWithValue, dispatch }) => {
  try {
    const { threads } = await api.getThreads();
    const uniqueCategories = [...new Set(threads.map((thread) => thread.category))];
    dispatch(setCategories(uniqueCategories));
    return threads;
  } catch (error) {
    return rejectWithValue(error.info());
  }
});

export const upVoteThreads = createAsyncThunk('threads/upVote', async (threadId, { rejectWithValue, dispatch, getState }) => {
  const authUser = getState().authUser?.data;
  try {
    dispatch(upVoteSync({ threadId, userId: authUser.id }));
    await api.setVoteThread(threadId, api.VoteType.UP_VOTE);
  } catch (error) {
    alert(error.message);
    return rejectWithValue({ threadId, userId: authUser.id, error: error.info() });
  }
});
export const downVoteThreads = createAsyncThunk('threads/downVote', async (threadId, { rejectWithValue, dispatch, getState }) => {
  const authUser = getState().authUser?.data;
  try {
    dispatch(downVoteSync({ threadId, userId: authUser.id }));
    await api.setVoteThread(threadId, api.VoteType.DOWN_VOTE);
  } catch (error) {
    alert(error.message);
    return rejectWithValue({ threadId, userId: authUser.id, error: error.info() });
  }
});
export const neutralVoteThreads = createAsyncThunk('threads/neutralVoteThreads', async (threadId, { rejectWithValue, dispatch, getState }) => {
  const authUser = getState().authUser?.data;
  const { upVotesBy, downVotesBy } = getState().threads.data.find((thread) => thread.id === threadId);
  try {
    dispatch(neutralVoteSync({ threadId, userId: authUser.id }));
    await api.setVoteThread(threadId, api.VoteType.NEUTRAL_VOTE);
  } catch (error) {
    alert(error.message);
    return rejectWithValue({ threadId, upVotesBy, downVotesBy, error: error.info() });
  }
});

export const addThread = createAsyncThunk('threads/add', async (newThread, { rejectWithValue }) => {
  try {
    const { thread, message } = await api.createThread(newThread);
    alert(message);
    return thread;
  } catch (error) {
    return rejectWithValue(error.info());
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
      const thread = state.data.find((thread) => thread.id === threadId);
      if (thread) {
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        thread.upVotesBy.push(userId);
      }
    },
    downVote: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.data.find((thread) => thread.id === threadId);
      if (thread) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy.push(userId);
      }
    },
    neutralVote: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.data.find((thread) => thread.id === threadId);
      if (thread) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      }
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
      .addCase(fetchThreads.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(addThread.pending, (state) => {
        state.error = null;
        state.isLoading = true;
        state.isCreated = false;
      })
      .addCase(addThread.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = [action.payload, ...state.data];
        state.isCreated = true;
      })
      .addCase(addThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isCreated = false;
      });

    builder
      .addCase(upVoteThreads.pending, (state) => {
        state.error = null;
      })
      .addCase(upVoteThreads.rejected, (state, action) => {
        const { threadId, userId, error } = action.payload;
        const thread = state.data.find((thread) => thread.id === threadId);
        if (thread) {
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        }
        state.error = error;
      });

    builder
      .addCase(downVoteThreads.pending, (state) => {
        state.error = null;
      })
      .addCase(downVoteThreads.rejected, (state, action) => {
        const { threadId, userId, error } = action.payload;
        const thread = state.data.find((thread) => thread.id === threadId);
        if (thread) {
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        }
        state.error = error;
      });

    builder
      .addCase(neutralVoteThreads.pending, (state) => {
        state.error = null;
      })
      .addCase(neutralVoteThreads.rejected, (state, action) => {
        const { threadId, upVotesBy, downVotesBy, error } = action.payload;
        const thread = state.data.find((thread) => thread.id === threadId);
        if (thread) {
          thread.upVotesBy = upVotesBy;
          thread.downVotesBy = downVotesBy;
        }
        state.error = error;
      });
  },
});

export const { upVote, downVote, neutralVote, clearError, resetCreatedStatus } = threadsSlice.actions;
export default threadsSlice.reducer;