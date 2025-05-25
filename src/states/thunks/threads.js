import api from '@utils/api';
import { VoteType } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { voteUpThread, voteDownThread, voteNeutralThread, threadVotesRollback } from '@states/slices/threads';


export const createThread = createAsyncThunk(
  'threads/create',
  async (payloads = {}, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    const { payload, signal } = payloads;
    try {
      const { message } = await api.createThread(payload, { signal });
      return { message };
    } catch (error) {
      return rejectWithValue({
        name: error.name,
        message: error.name === 'AbortError' ? 'Create thread was aborted' : error.message
      });
    }
  }
);

export const upVoteThread = createAsyncThunk(
  'threads/upVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState, rejectWithValue } = thunkApi;
    const { threadId, signal } = payloads;
    const thread = getState().threads.data.find((thread) => thread.id === threadId);
    const authUser = getState().auth.user;
    dispatch(voteUpThread({ threadId, userId: authUser.id }));
    try {
      await api.setVoteThread(threadId, VoteType.UP_VOTE, { signal });
    } catch (error) {
      const payload = {
        threadId,
        upVotesBy: thread.upVotesBy,
        downVotesBy: thread.downVotesBy
      };
      dispatch(threadVotesRollback(payload));
      return rejectWithValue({
        name: error.name,
        message: error.name === 'AbortError' ? 'upvote thread was aborted' : error.message
      });
    }
  }
);

export const downVoteThread = createAsyncThunk(
  'threads/downVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState, rejectWithValue } = thunkApi;
    const { threadId, signal } = payloads;
    const thread = getState().threads.data.find((thread) => thread.id === threadId);
    const authUser = getState().auth.user;
    dispatch(voteDownThread({ threadId, userId: authUser.id }));
    try {
      await api.setVoteThread(threadId, VoteType.DOWN_VOTE, { signal });
    } catch (error) {
      const payload = {
        threadId,
        upVotesBy: thread.upVotesBy,
        downVotesBy: thread.downVotesBy
      };
      dispatch(threadVotesRollback(payload));
      return rejectWithValue({
        name: error.name,
        message:
          error.name === 'AbortError'
            ? 'downvote thread was aborted'
            : error.message,
      });
    }
  }
);

export const neutralVoteThread = createAsyncThunk(
  'threads/neutralVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState, rejectWithValue } = thunkApi;
    const { threadId, signal } = payloads;
    const thread = getState().threads.data.find((thread) => thread.id === threadId);
    const authUser = getState().auth.user;
    dispatch(voteNeutralThread({ threadId, userId: authUser.id }));
    try {
      await api.setVoteThread(threadId, VoteType.NEUTRAL_VOTE, { signal });
    } catch (error) {
      const payload = {
        threadId,
        upVotesBy: thread.upVotesBy,
        downVotesBy: thread.downVotesBy
      };
      dispatch(threadVotesRollback(payload));
      return rejectWithValue({
        name: error.name,
        message:
          error.name === 'AbortError'
            ? 'neutralvote thread was aborted'
            : error.message,
      });
    }
  }
);