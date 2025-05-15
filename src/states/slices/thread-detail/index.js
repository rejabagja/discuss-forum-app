import api from '@utils/api';
import { VoteType } from '@constants';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  upVote as upVoteThreadSync,
  downVote as downVoteThreadSync,
  neutralVote as neutralVoteThreadSync,
  upComment as upCommentSync,
  downComment as downCommentSync,
  neutralComment as neutralCommentSync
} from './index';
import { toast } from 'react-toastify';


export const fetchThread = createAsyncThunk('threadDetail/fetchThread', async (threadId, { rejectWithValue }) => {
  try {
    const { detailThread } = await api.getThreadDetail(threadId);
    return detailThread;
  } catch (error) {
    if (error.message === 'thread tidak ditemukan') error.message = 'Thread not found';
    return rejectWithValue(error.info());
  }
});

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ content, threadId }, { rejectWithValue }) => {
    try {
      const { comment: newComment, message } = await api.createComment({
        content,
        threadId,
      });
      const toastMessage = `${message} successfully`;
      toast.success(toastMessage);
      return newComment;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.info());
    }
  }
);

export const upVoteThread = createAsyncThunk('threadDetail/upVote', async (threadId, { dispatch, rejectWithValue, getState }) => {
  const userId = getState().authUser.data.id;
  try {
    dispatch(upVoteThreadSync(userId));
    await api.setVoteThread(threadId, VoteType.UP_VOTE);
  } catch (error) {
    toast.error(error.message);
    return rejectWithValue({ userId, error: error.info() });
  }
});

export const downVoteThread = createAsyncThunk('threadDetail/downVote', async (threadId, { dispatch, rejectWithValue, getState }) => {
  const userId = getState().authUser.data.id;
  try {
    dispatch(downVoteThreadSync(userId));
    await api.setVoteThread(threadId, VoteType.DOWN_VOTE);
  } catch (error) {
    toast.error(error.message);
    return rejectWithValue({ userId, error: error.info() });
  }
});

export const neutralVoteThread = createAsyncThunk('threadDetail/neutralVote', async (threadId, { dispatch, rejectWithValue, getState }) => {
  const { authUser: { data: authUser }, threadDetail } = getState();
  try {
    dispatch(neutralVoteThreadSync(authUser.id));
    await api.setVoteThread(threadId, VoteType.NEUTRAL_VOTE);
  } catch (error) {
    toast.error(error.message);
    const { upVotesBy, downVotesBy } = threadDetail.data;
    return rejectWithValue({ upVotesBy, downVotesBy, error: error.info() });
  }
});

export const upVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const { authUser: { data: authUser }, threadDetail } = getState();
    try {
      dispatch(upCommentSync({ commentId, userId: authUser.id }));
      await api.setVoteComment({ commentId, threadId: threadDetail.data.id, voteType:VoteType.UP_VOTE });
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({ commentId, userId: authUser.id, error: error.info() });
    }
  }
);

export const downVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const { authUser: { data: authUser }, threadDetail } = getState();
    try {
      dispatch(downCommentSync({ commentId, userId: authUser.id }));
      await api.setVoteComment({ commentId, threadId: threadDetail.data.id, voteType:VoteType.DOWN_VOTE });
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({ commentId, userId: authUser.id, error: error.info() });
    }
  }
);

export const neutralVoteComment = createAsyncThunk(
  'threadDetail/neutralVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const { authUser: { data: authUser }, threadDetail } = getState();
    try {
      dispatch(neutralCommentSync({ commentId, userId: authUser.id }));
      await api.setVoteComment({ commentId, threadId: threadDetail.data.id, voteType:VoteType.NEUTRAL_VOTE });
    } catch (error) {
      toast.error(error.message);
      const { upVotesBy, downVotesBy } = threadDetail.data.comments.find((comment) => comment.id === commentId);
      return rejectWithValue({ commentId, upVotesBy, downVotesBy, error: error.info() });
    }
  }
);


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