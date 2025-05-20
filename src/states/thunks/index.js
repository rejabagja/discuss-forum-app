import api from '@utils/api';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppError } from '@utils';
import { setAuthUser } from '@states/slices/auth-user';
import { setThreads } from '@states/slices/threads';
import { setUsers } from '@states/slices/users';
import { setCategories } from '@states/slices/categories';
import { hideLoading, showLoading } from 'react-redux-loading-bar';


export const login = createAsyncThunk(
  'authUser/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { token } = await api.login(credentials);
      api.setAccessToken(token);
      toast.success('Login successfully');
      const { user } = await api.getOwnProfile();
      return user;
    } catch (error) {
      return rejectWithValue(error.info());
    }
  }
);

export const preloadProcess = createAsyncThunk('preload/process', async () => {
  try {
    const token = api.getAccessToken();
    if (!token) return;
    const { user } = await api.getOwnProfile();
    return user;
  } catch (error) {
    console.error(error.message);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (externalSignal = null, thunkApi) => {
  const { dispatch, rejectWithValue, signal } = thunkApi;
  const token = api.getAccessToken();
  try {
    if (!token) {
      throw new AppError('access token not found', 401);
    }
    const { data: { user } } = await api.getOwnProfile({ signal: externalSignal || signal });
    dispatch(setAuthUser(user));
  } catch (error) {
    if (error.name === 'AbortError') return;
    if (error.statusCode === 401) {
      if (token) api.removeAccessToken(); // if token exists, remove it
      return;
    }
    return rejectWithValue(
      {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      }
    );
  }
});

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/receive',
  async (_, { rejectWithValue }) => {
    try {
      const { leaderboards } = await api.getLeaderBoards();
      return leaderboards;
    } catch (error) {
      return rejectWithValue(error.info());
    }
  }
);

export const fetchUsersThreads = createAsyncThunk(
  'combine/fetchUsersThreads',
  async (externalSignal = null, thunkApi) => {
    const { dispatch, rejectWithValue, signal } = thunkApi;
    try {
      dispatch(showLoading());
      const { data: { threads } } = await api.getThreads({ signal: externalSignal || signal });
      const { data: { users } } = await api.getUsers({ signal: externalSignal || signal });

      const categories = [...new Set(threads.map((thread) => thread.category))];
      dispatch(setCategories(categories));
      dispatch(setUsers(users));
      dispatch(setThreads(threads));
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