import api from '@utils/api';
import { VoteType } from '@constants';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  upVote,
  downVote,
  neutralVote,
  upComment,
  downComment,
  neutralComment,
  setThreadData,
} from '@states/slices/thread-detail';
import { hideLoading, showLoading } from 'react-redux-loading-bar';


export const fetchThread = createAsyncThunk(
  'threadDetail/fetchThread',
  async (payload, thunkApi) => {
    const { threadId, externalSignal } = payload;
    const { rejectWithValue, signal, dispatch } = thunkApi;
    try {
      dispatch(showLoading());
      const { data: { detailThread } } = await api.getThreadDetail(threadId, { signal: externalSignal || signal });
      dispatch(setThreadData(detailThread));
    } catch (error) {
      if (error.name === 'AbortError') return;
      return rejectWithValue({
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
    } finally {
      dispatch(hideLoading());
    }
  }
);

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

export const upVoteThread = createAsyncThunk(
  'threadDetail/upVote',
  async (threadId, { dispatch, rejectWithValue, getState }) => {
    const userId = getState().authUser.data.id;
    try {
      dispatch(upVote(userId));
      await api.setVoteThread(threadId, VoteType.UP_VOTE);
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({ userId, error: error.info() });
    }
  }
);

export const downVoteThread = createAsyncThunk(
  'threadDetail/downVote',
  async (threadId, { dispatch, rejectWithValue, getState }) => {
    const userId = getState().authUser.data.id;
    try {
      dispatch(downVote(userId));
      await api.setVoteThread(threadId, VoteType.DOWN_VOTE);
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({ userId, error: error.info() });
    }
  }
);

export const neutralVoteThread = createAsyncThunk(
  'threadDetail/neutralVote',
  async (threadId, { dispatch, rejectWithValue, getState }) => {
    const {
      authUser: { data: authUser },
      threadDetail,
    } = getState();
    try {
      dispatch(neutralVote(authUser.id));
      await api.setVoteThread(threadId, VoteType.NEUTRAL_VOTE);
    } catch (error) {
      toast.error(error.message);
      const { upVotesBy, downVotesBy } = threadDetail.data;
      return rejectWithValue({ upVotesBy, downVotesBy, error: error.info() });
    }
  }
);

export const upVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const {
      authUser: { data: authUser },
      threadDetail,
    } = getState();
    try {
      dispatch(upComment({ commentId, userId: authUser.id }));
      await api.setVoteComment({
        commentId,
        threadId: threadDetail.data.id,
        voteType: VoteType.UP_VOTE,
      });
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({
        commentId,
        userId: authUser.id,
        error: error.info(),
      });
    }
  }
);

export const downVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const {
      authUser: { data: authUser },
      threadDetail,
    } = getState();
    try {
      dispatch(downComment({ commentId, userId: authUser.id }));
      await api.setVoteComment({
        commentId,
        threadId: threadDetail.data.id,
        voteType: VoteType.DOWN_VOTE,
      });
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({
        commentId,
        userId: authUser.id,
        error: error.info(),
      });
    }
  }
);

export const neutralVoteComment = createAsyncThunk(
  'threadDetail/neutralVoteComment',
  async (commentId, { dispatch, rejectWithValue, getState }) => {
    const {
      authUser: { data: authUser },
      threadDetail,
    } = getState();
    try {
      dispatch(neutralComment({ commentId, userId: authUser.id }));
      await api.setVoteComment({
        commentId,
        threadId: threadDetail.data.id,
        voteType: VoteType.NEUTRAL_VOTE,
      });
    } catch (error) {
      toast.error(error.message);
      const { upVotesBy, downVotesBy } = threadDetail.data.comments.find(
        (comment) => comment.id === commentId
      );
      return rejectWithValue({
        commentId,
        upVotesBy,
        downVotesBy,
        error: error.info(),
      });
    }
  }
);