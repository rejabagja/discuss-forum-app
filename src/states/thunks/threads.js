import api from '@utils/api';
import { toast } from 'react-toastify';
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
      const toastMessage = `${message} successfully`;
      toast.success(toastMessage);
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Request was aborted');
        return rejectWithValue({ message: null });
      };
      return rejectWithValue({ message: error.message });
    }
  }
);

export const upVoteThread = createAsyncThunk(
  'threads/upVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const { thread, signal } = payloads;
    const authUser = getState().auth.user;
    dispatch(voteUpThread({ threadId: thread.id, userId: authUser.id }));
    try {
      await api.setVoteThread(thread.id, VoteType.UP_VOTE, { signal });
    } catch (error) {
      dispatch(threadVotesRollback(thread));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);

export const downVoteThread = createAsyncThunk(
  'threads/downVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const { thread, signal } = payloads;
    const authUser = getState().auth.user;
    dispatch(voteDownThread({ threadId: thread.id, userId: authUser.id }));
    try {
      await api.setVoteThread(thread.id, VoteType.DOWN_VOTE, { signal });
    } catch (error) {
      dispatch(threadVotesRollback(thread));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);

export const neutralVoteThread = createAsyncThunk(
  'threads/neutralVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const { thread, signal } = payloads;
    const authUser = getState().auth.user;
    dispatch(voteNeutralThread({ threadId: thread.id, userId: authUser.id }));
    try {
      await api.setVoteThread(thread.id, VoteType.NEUTRAL_VOTE, { signal });
    } catch (error) {
      dispatch(threadVotesRollback(thread));
      toast.error(error.name === 'AbortError' ? 'Request was aborted' : error.message);
    }
  }
);