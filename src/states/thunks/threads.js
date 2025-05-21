import api from '@utils/api';
import { toast } from 'react-toastify';
import { VoteType } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { upVote, downVote, neutralVote } from '@states/slices/threads';


export const createThread = createAsyncThunk(
  'threads/create',
  async (payloads, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    const { payload, signal } = payloads;
    try {
      const { data: { thread }, message } = await api.createThread(payload, { signal: signal || thunkApi.signal });
      const toastMessage = `${message} successfully`;
      toast.success(toastMessage);
      return thread;
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Request was aborted');
      };
      return rejectWithValue({
        name: error.name,
        message: error.message,
      });
    }
  }
);

export const upVoteThreads = createAsyncThunk(
  'threads/upVote',
  async (threadId, { rejectWithValue, dispatch, getState }) => {
    const authUser = getState().authUser.data;
    try {
      dispatch(upVote({ threadId, userId: authUser.id }));
      await api.setVoteThread(threadId, VoteType.UP_VOTE);
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({
        threadId,
        userId: authUser.id,
        error: error.info(),
      });
    }
  }
);

export const downVoteThreads = createAsyncThunk(
  'threads/downVote',
  async (threadId, { rejectWithValue, dispatch, getState }) => {
    const authUser = getState().authUser.data;
    try {
      dispatch(downVote({ threadId, userId: authUser.id }));
      await api.setVoteThread(threadId, VoteType.DOWN_VOTE);
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({
        threadId,
        userId: authUser.id,
        error: error.info(),
      });
    }
  }
);

export const neutralVoteThreads = createAsyncThunk(
  'threads/neutralVote',
  async (threadId, { rejectWithValue, dispatch, getState }) => {
    const authUser = getState().authUser.data;
    const { upVotesBy, downVotesBy } = getState().threads.data.find(
      (thread) => thread.id === threadId
    );
    try {
      dispatch(neutralVote({ threadId, userId: authUser.id }));
      await api.setVoteThread(threadId, VoteType.NEUTRAL_VOTE);
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue({
        threadId,
        upVotesBy,
        downVotesBy,
        error: error.info(),
      });
    }
  }
);