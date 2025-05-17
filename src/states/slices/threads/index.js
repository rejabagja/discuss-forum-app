import { createSlice } from '@reduxjs/toolkit';
import {
  fetchThreads,
  addThread,
  upVoteThreads,
  downVoteThreads,
  neutralVoteThreads,
} from '@states/thunks/threads';


const initialState = {
  data: [],
  error: null,
  isLoading: false,
  createStatus: false,
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    upVote: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.data.find((thread) => thread.id === threadId);
      if (!thread) return;
      if (thread.downVotesBy.includes(userId)) {
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      }
      thread.upVotesBy.push(userId);
    },
    downVote: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.data.find((thread) => thread.id === threadId);
      if (!thread) return;
      if (thread.upVotesBy.includes(userId)) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      }
      thread.downVotesBy.push(userId);
    },
    neutralVote: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.data.find((thread) => thread.id === threadId);
      if (!thread) return;
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = false;
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
        state.isLoading = true;
        state.error = null;
        state.createStatus = false;
      })
      .addCase(addThread.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload);
        state.createStatus = true;
      })
      .addCase(addThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createStatus = false;
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
          state.error = error;
        }
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
          state.error = error;
        }
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
          state.error = error;
        }
      });
  },
});

export const { upVote, downVote, neutralVote, clearError, resetCreateStatus } = threadsSlice.actions;
export default threadsSlice.reducer;