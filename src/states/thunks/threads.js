import api from '@utils/api';
import { toast } from 'react-toastify';
import { VoteType } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { upVote, downVote, neutralVote, threadRollback } from '@states/slices/threads';


export const createThread = createAsyncThunk(
  'threads/create',
  async (payloads = {}, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    const { payload, signal } = payloads;
    try {
      const { data: { thread }, message } = await api.createThread(payload, { signal });
      const toastMessage = `${message} successfully`;
      toast.success(toastMessage);
      return thread;
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Request was aborted');
        return rejectWithValue({ message: null });
      };
      return rejectWithValue({ message: error.message });
    }
  }
);

export const upVoteThreads = createAsyncThunk(
  'threads/upVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const { thread, signal } = payloads;
    const authUser = getState().auth.user;
    try {
      dispatch(upVote({ threadId: thread.id, userId: authUser.id }));
      await api.setVoteThread(thread.id, VoteType.UP_VOTE), { signal };
    } catch (error) {
      dispatch(threadRollback(thread));
      console.error(error.message);
    }
  }
);

export const downVoteThreads = createAsyncThunk(
  'threads/downVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const { thread, signal } = payloads;
    const authUser = getState().auth.user;
    try {
      dispatch(downVote({ threadId: thread.id, userId: authUser.id }));
      await api.setVoteThread(thread.id, VoteType.DOWN_VOTE, { signal });
    } catch (error) {
      dispatch(threadRollback(thread));
      console.error(error.message);
    }
  }
);

export const neutralVoteThreads = createAsyncThunk(
  'threads/neutralVote',
  async (payloads = {}, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const { thread, signal } = payloads;
    const authUser = getState().auth.user;
    try {
      dispatch(neutralVote({ threadId: thread.id, userId: authUser.id }));
      await api.setVoteThread(thread.id, VoteType.NEUTRAL_VOTE, { signal });
    } catch (error) {
      dispatch(threadRollback(thread));
      console.error(error.message);
    }
  }
);