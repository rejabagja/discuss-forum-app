import api from '@utils/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  upVote as upVoteSync,
  downVote as downVoteSync,
  neutralVote as neutralVoteSync,
  upComment as upCommentSync,
  downComment as downCommentSync,
  neutralComment as neutralCommentSync
} from './index';

export const ErrorType = {
  NOT_FOUND: 'NOT_FOUND',
  CREATE_COMMENT: 'CREATE_COMMENT',
};

export const fetchThread = createAsyncThunk('threadDetail/fetchThread', async (threadId, { rejectWithValue }) => {
  try {
    const { detailThread } = await api.getThreadDetail(threadId);
    return detailThread;
  } catch (error) {
    return rejectWithValue({
      type: ErrorType.NOT_FOUND,
      message: error,
    });
  }
});

export const upVoteThread = createAsyncThunk('threadDetail/upVote', async (threadId, { dispatch, rejectWithValue, getState }) => {
  const { authUser } = getState();
  try {
    dispatch(upVoteSync({ userId: authUser.data.id }));
    await api.setVoteThread(threadId, api.VoteType.UP_VOTE);
  } catch (error) {
    alert(error);
    return rejectWithValue(authUser.data.id);
  }
});

export const downVoteThread = createAsyncThunk('threadDetail/downVote', async (threadId, { dispatch, rejectWithValue, getState }) => {
  const { authUser } = getState();
  try {
    dispatch(downVoteSync({ userId: authUser.data.id }));
    await api.setVoteThread(threadId, api.VoteType.DOWN_VOTE);
  } catch (error) {
    alert(error);
    return rejectWithValue(authUser.data.id);
  }
});

export const neutralVoteThread = createAsyncThunk('threadDetail/neutralVote', async (threadId, { dispatch, rejectWithValue, getState }) => {
  const { authUser, threadDetail } = getState();
  try {
    dispatch(neutralVoteSync({ userId: authUser.data.id }));
    await api.setVoteThread(threadId, api.VoteType.NEUTRAL_VOTE);
  } catch (error) {
    alert(error);
    const { upVotesBy, downVotesBy } = threadDetail.data;
    return rejectWithValue({ upVotesBy, downVotesBy });
  }
});

export const upVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const { authUser, threadDetail } = getState();
    try {
      dispatch(upCommentSync({ commentId, userId: authUser.data.id }));
      await api.setVoteComment({ commentId, threadId: threadDetail.data.id, voteType:api.VoteType.UP_VOTE });
    } catch (error) {
      alert(error);
      return rejectWithValue(authUser.data.id);
    }
  }
);

export const downVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const { authUser, threadDetail } = getState();
    try {
      dispatch(downCommentSync({ commentId, userId: authUser.data.id }));
      await api.setVoteComment({ commentId, threadId: threadDetail.data.id, voteType:api.VoteType.DOWN_VOTE });
    } catch (error) {
      alert(error);
      return rejectWithValue(authUser.data.id);
    }
  }
);

export const neutralVoteComment = createAsyncThunk(
  'threadDetail/neutralVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const { authUser, threadDetail } = getState();
    try {
      dispatch(neutralCommentSync({ commentId, userId: authUser.data.id }));
      await api.setVoteComment({ commentId, threadId: threadDetail.data.id, voteType:api.VoteType.NEUTRAL_VOTE });
    } catch (error) {
      alert(error);
      const { id, upVotesBy, downVotesBy } = threadDetail.data.comments.find((comment) => comment.id === commentId);
      return rejectWithValue({ id, upVotesBy, downVotesBy });
    }
  }
);

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ content, threadId }, { rejectWithValue }) => {
    try {
      const { comment: newComment } = await api.createComment({ content, threadId });
      return { newComment };
    } catch (error) {
      alert(error);
      return rejectWithValue({
        type: ErrorType.CREATE_COMMENT,
        message: error,
      });
    }
  }
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    upVote: (state, action) => {
      const { userId } = action.payload;
      if (state.data.downVotesBy.includes(userId)) {
        state.data.downVotesBy = state.data.downVotesBy.filter((id) => id !== userId);
      }
      state.data.upVotesBy.push(userId);
    },
    downVote: (state, action) => {
      const { userId } = action.payload;
      if (state.data.upVotesBy.includes(userId)) {
        state.data.upVotesBy = state.data.upVotesBy.filter(
          (id) => id !== userId
        );
      }
      state.data.downVotesBy.push(userId);
    },
    neutralVote: (state, action) => {
      const { userId } = action.payload;
      state.data.upVotesBy = state.data.upVotesBy.filter((id) => id !== userId);
      state.data.downVotesBy = state.data.downVotesBy.filter((id) => id !== userId);
    },
    upComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find((comment) => comment.id === commentId);
      if (comment) {
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
        comment.upVotesBy.push(userId);
      }
    },
    downComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find(
        (comment) => comment.id === commentId
      );
      if (comment) {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        comment.downVotesBy.push(userId);
      }
    },
    neutralComment: (state, action) => {
      const { commentId, userId } = action.payload;
      const comment = state.data.comments.find(
        (comment) => comment.id === commentId
      );
      if (comment) {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThread.pending, (state) => {
        state.error = null;
        state.data = null;
      })
      .addCase(fetchThread.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchThread.rejected, (state, action) => {
        state.data = null;
        state.error = action.payload;
      });

    builder
      .addCase(createComment.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const { newComment } = action.payload;
        state.data.comments.unshift(newComment);
        state.isLoading = false;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });

    builder.addCase(upVoteThread.rejected, (state, action) => {
      state.data.upVotesBy = state.data.upVotesBy.filter(
        (id) => id !== action.payload
      );
    });

    builder.addCase(downVoteThread.rejected, (state, action) => {
      state.data.upVotesBy = state.data.downVotesBy.filter(
        (id) => id !== action.payload
      );
    });

    builder.addCase(neutralVoteThread.rejected, (state, action) => {
      state.data = { ...state.data, ...action.payload };
    });

    builder.addCase(upVoteComment.rejected, (state, action) => {
      const comment = state.data.comments.find((comment) => comment.id === action.payload);
      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== action.payload);
    });

    builder.addCase(downVoteComment.rejected, (state, action) => {
      const comment = state.data.comments.find((comment) => comment.id === action.payload);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== action.payload);
    });

    builder.addCase(neutralVoteComment.rejected, (state, action) => {
      const comment = state.data.comments.find(
        (comment) => comment.id === action.payload.id
      );
      if (comment) {
        comment.upVotesBy = action.payload.upVotesBy;
        comment.downVotesBy = action.payload.downVotesBy;
      }
    });
  },
});


export const { upVote, downVote, neutralVote, upComment, downComment, neutralComment } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;