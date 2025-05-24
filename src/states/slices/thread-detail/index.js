import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  data: null,
};

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState,
  reducers: {
    voteUpThread: (state, action) => {
      const userId = action.payload;
      if (state.data.upVotesBy.includes(userId)) return;
      if (state.data.downVotesBy.includes(userId)) {
        state.data.downVotesBy = state.data.downVotesBy.filter((id) => id !== userId);
      }
      state.data.upVotesBy.push(userId);
    },
    voteDownThread: (state, action) => {
      const userId = action.payload;
      if (state.data.downVotesBy.includes(userId)) return;
      if (state.data.upVotesBy.includes(userId)) {
        state.data.upVotesBy = state.data.upVotesBy.filter(
          (id) => id !== userId
        );
      }
      state.data.downVotesBy.push(userId);
    },
    voteNeutralThread: (state, action) => {
      const userId = action.payload;
      if (!state.data.upVotesBy.includes(userId) && !state.data.downVotesBy.includes(userId)) return;
      state.data.upVotesBy = state.data.upVotesBy.filter((id) => id !== userId);
      state.data.downVotesBy = state.data.downVotesBy.filter((id) => id !== userId);
    },
    voteUpComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find((comment) => comment.id === commentId);
      if (!comment || comment.upVotesBy.includes(userId)) return;
      if (comment.downVotesBy.includes(userId)) {
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      }
      comment.upVotesBy.push(userId);
    },
    voteDownComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find(
        (comment) => comment.id === commentId
      );
      if (!comment || comment.downVotesBy.includes(userId)) return;
      if (comment.upVotesBy.includes(userId)) {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      }
      comment.downVotesBy.push(userId);
    },
    voteNeutralComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find(
        (comment) => comment.id === commentId
      );
      if (!comment || !comment.upVotesBy.includes(userId) && !comment.downVotesBy.includes(userId)) return;
      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
    },
    setThreadData: (state, action) => {
      state.data = action.payload;
    },
    addNewComment: (state, action) => {
      state.data.comments.unshift(action.payload);
    },
    threadVotesRollback: (state, action) => {
      state.data.upVotesBy = action.payload.upVotesBy;
      state.data.downVotesBy = action.payload.downVotesBy;
    },
    commentVotesRollback: (state, action) => {
      const { commentId } = action.payload;
      const comment = state.data.comments.find((comment) => comment.id === commentId);
      if (!comment) return;
      comment.upVotesBy = action.payload.upVotesBy;
      comment.downVotesBy = action.payload.downVotesBy;
    },
  },
});


export const {
  voteUpThread, voteDownThread, voteNeutralThread,
  voteUpComment, voteDownComment, voteNeutralComment,
  setThreadData, addNewComment, threadVotesRollback,
  commentVotesRollback }
= threadDetailSlice.actions;
export default threadDetailSlice.reducer;