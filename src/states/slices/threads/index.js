import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  data: [],
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    voteUpThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.data.find((thread) => thread.id === threadId);
      if (!thread || thread.upVotesBy.includes(userId)) return;
      if (thread.downVotesBy.includes(userId)) {
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      }
      thread.upVotesBy.push(userId);
    },
    voteDownThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.data.find((thread) => thread.id === threadId);
      if (!thread || thread.downVotesBy.includes(userId)) return;
      if (thread.upVotesBy.includes(userId)) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      }
      thread.downVotesBy.push(userId);
    },
    voteNeutralThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.data.find((thread) => thread.id === threadId);
      if (!thread || !thread.upVotesBy.includes(userId) && !thread.downVotesBy.includes(userId)) return;
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
    },
    setThreadsData: (state, action) => {
      state.data = action.payload;
    },
    threadVotesRollback: (state, action) => {
      const { threadId } = action.payload;
      const targetIndex = state.data.findIndex((thread) => thread.id === threadId);
      if (targetIndex !== -1) {
        state.data[targetIndex].upVotesBy = action.payload.upVotesBy;
        state.data[targetIndex].downVotesBy = action.payload.downVotesBy;
      }
    },
  }
});

export const { voteUpThread, voteDownThread, voteNeutralThread, setThreadsData, threadVotesRollback } = threadsSlice.actions;
export default threadsSlice.reducer;