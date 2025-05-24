import api from '@utils/api';
import { VoteType } from '@constants';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  voteUpThread,
  voteDownThread,
  voteNeutralThread,
  voteUpComment,
  voteDownComment,
  voteNeutralComment,
  setThreadData,
  addNewComment,
  threadVotesRollback,
  commentVotesRollback,
} from '@states/slices/thread-detail';
import { hideLoading, showLoading } from 'react-redux-loading-bar';


export const fetchThread = createAsyncThunk(
  'threadDetail/fetchThread',
  async (payloads = {}, thunkApi) => {
    const { threadId, signal } = payloads;
    const { rejectWithValue, dispatch } = thunkApi;
    try {
      dispatch(showLoading());
      const { detailThread } = await api.getThreadDetail(threadId, { signal });
      dispatch(setThreadData(detailThread));
    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue({
          name: error.name,
          message: 'Request was aborted',
          statusCode: 408,
        });
      }
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
  async (payloads = {}, thunkApi) => {
    const { dispatch } = thunkApi;
    const { payload, signal } = payloads;
    try {
      const { comment, message } = await api.createComment(payload, { signal });
      dispatch(addNewComment(comment));
      const toastMessage = `${message} successfully`;
      if (!toast.isActive('create-comment-success')) {
        toast.success(toastMessage, {
          toastId: 'create-comment-success',
        });
      }
    } catch (error) {
      if (!toast.isActive('create-comment-error')) {
        toast.error(
          error.name === 'AbortError' ? 'Request was aborted' : error.message,
          {
            toastId: 'create-comment-error',
          }
        );
      }
    }
  }
);

export const upVoteThreadDetail = createAsyncThunk(
  'threadDetail/upVote',
  async (payloads = {}, thunkApi) => {
    const { threadId, signal } = payloads;
    const { dispatch, getState } = thunkApi;
    const userId = getState().auth.user.id;
    const { upVotesBy, downVotesBy } = getState().threadDetail.data;
    dispatch(voteUpThread(userId));
    try {
      await api.setVoteThread(threadId, VoteType.UP_VOTE, { signal });
    } catch (error) {
      dispatch(threadVotesRollback({ upVotesBy, downVotesBy }));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);

export const downVoteThreadDetail = createAsyncThunk(
  'threadDetail/downVote',
  async (payloads = {}, thunkApi) => {
    const { threadId, signal } = payloads;
    const { dispatch, getState } = thunkApi;
    const userId = getState().auth.user.id;
    const { upVotesBy, downVotesBy } = getState().threadDetail.data;
    dispatch(voteDownThread(userId));
    try {
      await api.setVoteThread(threadId, VoteType.DOWN_VOTE, { signal });
    } catch (error) {
      dispatch(threadVotesRollback({ upVotesBy, downVotesBy }));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);

export const neutralVoteThreadDetail = createAsyncThunk(
  'threadDetail/neutralVote',
  async (payloads = {}, thunkApi) => {
    const { threadId, signal } = payloads;
    const { dispatch, getState } = thunkApi;
    const userId = getState().auth.user.id;
    const { upVotesBy, downVotesBy } = getState().threadDetail.data;
    dispatch(voteNeutralThread(userId));
    try {
      await api.setVoteThread(threadId, VoteType.NEUTRAL_VOTE, { signal });
    } catch (error) {
      dispatch(threadVotesRollback({ upVotesBy, downVotesBy }));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);

export const upVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async (payloads = {}, thunkApi) => {
    const { commentId, signal } = payloads;
    const { dispatch, getState } = thunkApi;
    const authUser = getState().auth.user;
    const threadDetail = getState().threadDetail.data;
    const { upVotesBy, downVotesBy } = threadDetail.comments.find((comment) => comment.id === commentId);

    dispatch(voteUpComment({ commentId, userId: authUser.id }));
    try {
      const payload = { commentId, threadId: threadDetail.id, voteType: VoteType.UP_VOTE };
      await api.setVoteComment(payload, { signal });
    } catch (error) {
      dispatch(commentVotesRollback({ commentId, upVotesBy, downVotesBy }));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);

export const downVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async (payloads = {}, thunkApi) => {
    const { commentId, signal } = payloads;
    const { dispatch, getState } = thunkApi;
    const authUser = getState().auth.user;
    const threadDetail = getState().threadDetail.data;
    const { upVotesBy, downVotesBy } = threadDetail.comments.find((comment) => comment.id === commentId);

    dispatch(voteDownComment({ commentId, userId: authUser.id }));
    try {
      const payload = { commentId, threadId: threadDetail.id, voteType: VoteType.DOWN_VOTE };
      await api.setVoteComment(payload, { signal });
    } catch (error) {
      dispatch(commentVotesRollback({ commentId, upVotesBy, downVotesBy }));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);

export const neutralVoteComment = createAsyncThunk(
  'threadDetail/neutralVoteComment',
  async (payloads = {}, thunkApi) => {
    const { commentId, signal } = payloads;
    const { dispatch, getState } = thunkApi;
    const authUser = getState().auth.user;
    const threadDetail = getState().threadDetail.data;
    const { upVotesBy, downVotesBy } = threadDetail.comments.find((comment) => comment.id === commentId);

    dispatch(voteNeutralComment({ commentId, userId: authUser.id }));
    try {
      const payload = { commentId, threadId: threadDetail.id, voteType: VoteType.NEUTRAL_VOTE };
      await api.setVoteComment(payload, { signal });
    } catch (error) {
      dispatch(commentVotesRollback({ commentId, upVotesBy, downVotesBy }));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);