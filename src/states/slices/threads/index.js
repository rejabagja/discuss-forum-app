import { createSlice } from '@reduxjs/toolkit';
import {
  upVoteThreads,
  downVoteThreads,
  neutralVoteThreads,
} from '@states/thunks/threads';


const initialState = {
  data: [],
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
    setThreads: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
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

export const { upVote, downVote, neutralVote, setThreads } = threadsSlice.actions;
export default threadsSlice.reducer;