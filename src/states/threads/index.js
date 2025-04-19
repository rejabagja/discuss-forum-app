import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { setCategories } from '@states/categories';
import { upVote as upVoteSync, downVote as downVoteSync, neutralVote as neutralVoteSync } from '@states/threads';


export const fetchThreads = createAsyncThunk('threads/fetchThreads', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showLoading());
    const { threads } = await api.getThreads();
    const threadCategories = [
      ...new Set(threads.map((thread) => thread.category)),
    ];

    dispatch(setCategories(threadCategories));
    return threads;
  } catch (error) {
    return rejectWithValue(error);
  } finally {
    dispatch(hideLoading());
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

export const addThread = createAsyncThunk('threads/add', async (thread, { rejectWithValue }) => {
  try {
    const { thread: newThread } = await api.createThread(thread);
    return newThread;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const threadsSlice = createSlice({
  name: 'threads',
  initialState: [],
  reducers: {
    upVote: (state, action) => {
      const { threadId, userId } = action.payload;
      return state.map((thread) => {
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
      return state.map((thread) => {
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
      return state.map((thread) => {
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchThreads.fulfilled, (state, action) => (action.payload));
  },
});

export const { upVote, downVote, neutralVote } = threadsSlice.actions;
export default threadsSlice.reducer;