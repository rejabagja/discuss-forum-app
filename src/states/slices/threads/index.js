import { createSlice } from '@reduxjs/toolkit';


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
    },
    threadRollback: (state, action) => {
      const targetIndex = state.data.findIndex((thread) => thread.id === action.payload.id);
      if (targetIndex !== -1) {
        state.data[targetIndex] = action.payload;
      }
    },
  }
});

export const { upVote, downVote, neutralVote, setThreads, threadRollback } = threadsSlice.actions;
export default threadsSlice.reducer;