import { createSlice } from '@reduxjs/toolkit';
import {
  fetchThread,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
} from '@states/thunks/thread_detail';


const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState,
  reducers: {
    upVote: (state, action) => {
      const userId = action.payload;
      if (state.data.downVotesBy.includes(userId)) {
        state.data.downVotesBy = state.data.downVotesBy.filter((id) => id !== userId);
      }
      state.data.upVotesBy.push(userId);
    },
    downVote: (state, action) => {
      const userId = action.payload;
      if (state.data.upVotesBy.includes(userId)) {
        state.data.upVotesBy = state.data.upVotesBy.filter(
          (id) => id !== userId
        );
      }
      state.data.downVotesBy.push(userId);
    },
    neutralVote: (state, action) => {
      const userId = action.payload;
      state.data.upVotesBy = state.data.upVotesBy.filter((id) => id !== userId);
      state.data.downVotesBy = state.data.downVotesBy.filter((id) => id !== userId);
    },
    upComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find((comment) => comment.id === commentId);
      if (!comment) return;
      if (comment.downVotesBy.includes(userId)) {
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      }
      comment.upVotesBy.push(userId);
    },
    downComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find(
        (comment) => comment.id === commentId
      );
      if (!comment) return;
      if (comment.upVotesBy.includes(userId)) {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      }
      comment.downVotesBy.push(userId);
    },
    neutralComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find(
        (comment) => comment.id === commentId
      );
      if (!comment) return;
      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThread.pending, (state) => {
        state.data = null;
        state.error = null;
      })
      .addCase(fetchThread.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchThread.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(createComment.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(upVoteThread.pending, (state) => {
        state.error = null;
      })
      .addCase(upVoteThread.rejected, (state, action) => {
        const { userId, error } = action.payload;
        state.data.upVotesBy = state.data.upVotesBy.filter(
          (id) => id !== userId
        );
        state.error = error;
      });

    builder
      .addCase(downVoteThread.pending, (state) => {
        state.error = null;
      })
      .addCase(downVoteThread.rejected, (state, action) => {
        const { userId, error } = action.payload;
        state.data.downVotesBy = state.data.downVotesBy.filter(
          (id) => id !== userId
        );
        state.error = error;
      });

    builder
      .addCase(neutralVoteThread.pending, (state) => {
        state.error = null;
      })
      .addCase(neutralVoteThread.rejected, (state, action) => {
        const { upVotesBy, downVotesBy, error } = action.payload;
        state.data = { ...state.data, upVotesBy, downVotesBy };
        state.error = error;
      });

    builder
      .addCase(upVoteComment.pending, (state) => {
        state.error = null;
      })
      .addCase(upVoteComment.rejected, (state, action) => {
        const { commentId, userId, error } = action.payload;
        const comment = state.data.comments.find((comment) => comment.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          state.error = error;
        }
      });

    builder
      .addCase(downVoteComment.pending, (state) => {
        state.error = null;
      })
      .addCase(downVoteComment.rejected, (state, action) => {
        const { commentId, userId, error } = action.payload;
        const comment = state.data.comments.find((comment) => comment.id === commentId);
        if (comment) {
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
          state.error = error;
        }
      });

    builder
      .addCase(neutralVoteComment.pending, (state) => {
        state.error = null;
      })
      .addCase(neutralVoteComment.rejected, (state, action) => {
        const { commentId, upVotesBy, downVotesBy, error } = action.payload;
        const comment = state.data.comments.find(
          (comment) => comment.id === commentId
        );
        if (comment) {
          comment.upVotesBy = upVotesBy;
          comment.downVotesBy = downVotesBy;
          state.error = error;
        }
      });
  },
});


export const { upVote, downVote, neutralVote, upComment, downComment, neutralComment } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;