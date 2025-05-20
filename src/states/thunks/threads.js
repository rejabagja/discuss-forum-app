import api from '@utils/api';
import { toast } from 'react-toastify';
import { VoteType } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { upVote, downVote, neutralVote } from '@states/slices/threads';


export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (signal, { rejectWithValue }) => {
    try {
      const { data: { threads } } = await api.getThreads({ signal });
      return threads;
    } catch (error) {
      if (error.name === 'AbortError') return;
      return rejectWithValue({
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }
);

export const addThread = createAsyncThunk(
  'threads/add',
  async (newThread, { rejectWithValue }) => {
    try {
      const { thread, message } = await api.createThread(newThread);
      const toastMessage = `${message} successfully`;
      toast.success(toastMessage);
      return thread;
    } catch (error) {
      return rejectWithValue(error.info());
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