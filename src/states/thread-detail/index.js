import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/api';


export const receiveThreadDetail = createAsyncThunk('threadDetail/receive', async (threadId, { rejectWithValue }) => {
  try {
    const { thread } = await api.getThreadDetail(threadId);
    return { thread };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const upVoteThreadDetail = createAsyncThunk('threadDetail/upVoteTD', async (threadId, { dispatch, rejectWithValue, getState }) => {
  let userId;
  try {
    const { authUser } = getState();
    userId = authUser.id;
    dispatch({ type: 'threadDetail/upVote', payload: { userId } });
    await api.setVoteThread(threadId, api.VoteType.UP_VOTE);
  } catch (error) {
    dispatch({ type: 'threadDetail/upVote', payload: { userId } });
    return rejectWithValue(error);
  }
});

export const downVoteThreadDetail = createAsyncThunk('threadDetail/downVoteTD', async (threadId, { dispatch, rejectWithValue, getState }) => {
  let userId;
  try {
    const { authUser } = getState();
    userId = authUser.id;
    dispatch({ type: 'threadDetail/downVote', payload: { userId } });
    await api.setVoteThread(threadId, api.VoteType.DOWN_VOTE);
  } catch (error) {
    dispatch({ type: 'threadDetail/downVote', payload: { userId } });
    return rejectWithValue(error);
  }
});

export const neutralVoteThreadDetail = createAsyncThunk('threadDetail/neutralVoteTD', async (threadId, { dispatch, rejectWithValue, getState }) => {
  let userId;
  try {
    const { authUser } = getState();
    userId = authUser.id;
    dispatch({ type: 'threadDetail/neutralVote', payload: { userId } });
    await api.setVoteThread(threadId, api.VoteType.NEUTRAL_VOTE);
  } catch (error) {
    dispatch({ type: 'threadDetail/neutralVote', payload: { userId } });
    return rejectWithValue(error);
  }
});

export const upVoteCommentThreadDetail = createAsyncThunk(
  'threadDetail/upVoteCommentTD',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        authUser: { id: userId },
        threadDetail: { thread: { id: threadId } },
      } = getState();
      dispatch({ type: 'threadDetail/upVoteComment', payload: { commentId, userId } });
      await api.setVoteThread({ commentId, threadId, voteType:api.VoteType.UP_VOTE });
    } catch (error) {
      dispatch({ type: 'threadDetail/upVoteComment', payload: { commentId, userId } });
      return rejectWithValue(error);
    }
  }
);

export const downVoteCommentThreadDetail = createAsyncThunk(
  'threadDetail/downVoteCommentTD',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        authUser: { id: userId },
        threadDetail: {
          thread: { id: threadId },
        },
      } = getState();
      dispatch({ type: 'threadDetail/downVoteComment', payload: { commentId, userId } });
      await api.setVoteThread({ commentId, threadId, voteType:api.VoteType.DOWN_VOTE });
    } catch (error) {
      dispatch({ type: 'threadDetail/downVoteComment', payload: { commentId, userId } });
      return rejectWithValue(error);
    }
  }
);

export const neutralVoteCommentThreadDetail = createAsyncThunk(
  'threadDetail/neutralVoteCommentTD',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        authUser: { id: userId },
        threadDetail: {
          thread: { id: threadId },
        },
      } = getState();
      dispatch({ type: 'threadDetail/neutralVoteComment', payload: { commentId, userId } });
      await api.setVoteThread({ commentId, threadId, voteType:api.VoteType.NEUTRAL_VOTE });
    } catch (error) {
      dispatch({ type: 'threadDetail/neutralVoteComment', payload: { commentId, userId } });
      return rejectWithValue(error);
    }
  }
);

export const addNewCommentThreadDetail = createAsyncThunk(
  'threadDetail/addNewCommentTD',
  async ({ content, threadId }, { rejectWithValue, getState, dispatch }) => {
    const { authUser: owner } = getState();
    const tempComment = {
      id: `temp-${+new Date()}`,
      content,
      createdAt: new Date().toISOString(),
      upVotesBy: [],
      downVotesBy: [],
      owner,
    };
    try {
      dispatch({ type: 'threadDetail/addNewCommentTemp', payload: tempComment });
      const { comment: newComment } = await api.createComment({ content, threadId });
      return { newComment, tempCommentId: tempComment.id };
    } catch (error) {
      dispatch({ type: 'threadDetail/removeNewCommentTemp', payload: tempComment.id });
      return rejectWithValue(error);
    }
  }
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    thread: null,
    error: null,
  },
  reducers: {
    upVote: (state, action) => {
      const { userId } = action.payload;
      if (!state.thread.upVotesBy.includes(userId)) {
        state.thread.downVotesBy = state.thread.downVotesBy.filter(
          (id) => id !== userId
        );
        state.thread.upVotesBy.push(userId);
      }
    },
    downVote: (state, action) => {
      const { userId } = action.payload;
      if (!state.thread.downVotesBy.includes(userId)) {
        state.thread.upVotesBy = state.thread.upVotesBy.filter(
          (id) => id !== userId
        );
        state.thread.downVotesBy.push(userId);
      }
    },
    neutralVote: (state, action) => {
      const { userId } = action.payload;
      state.thread.upVotesBy.filter((id) => id !== userId);
      state.thread.downVotesBy.filter((id) => id !== userId);
    },
    upVoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      return state.thread.comments.map((comment) => {
        if (comment.id === commentId && !comment.upVotesBy.includes(userId)) {
          return {
            ...comment,
            downVotesBy: comment.downVotesBy.filter((id) => id !== userId),
            upVotesBy: [...comment.upVotesBy, userId],
          };
        }
        return comment;
      });
    },
    downVoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      return state.thread.comments.map((comment) => {
        if (comment.id === commentId && !comment.downVotesBy.includes(userId)) {
          return {
            ...comment,
            upVotesBy: comment.upVotesBy.filter((id) => id !== userId),
            downVotesBy: [...comment.downVotesBy, userId],
          };
        }
        return comment;
      });
    },
    neutralVoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      return state.thread.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            downVotesBy: comment.downVotesBy.filter((id) => id !== userId),
            upVotesBy: comment.upVotesBy.filter((id) => id !== userId),
          };
        }
        return comment;
      });
    },
    addNewCommentTemp: (state, action) => {
      state.thread.comments.push(action.payload);
    },
    removeNewCommentTemp: (state, action) => {
      state.thread.comments = state.thread.comments.filter(
        (comment) => comment.id !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder.addCase(receiveThreadDetail.fulfilled, (state, action) => {
      state.error = null;
      state.thread = action.payload.thread;
    });
    builder.addCase(receiveThreadDetail.rejected, (state, action) => {
      state.thread = null;
      state.error = action.payload;
    });
    builder.addCase(addNewCommentThreadDetail.fulfilled, (state, action) => {
      const tempCommentIndex = state.thread.comments.findIndex((comment) => comment.id === action.payload.tempCommentId);
      state.thread.comments[tempCommentIndex] = action.payload.newComment;
      state.error = null;
    });
    builder.addCase(addNewCommentThreadDetail.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});


export const { upVote, downVote, neutralVote, upVoteComment, downVoteComment, neutralVoteComment } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;