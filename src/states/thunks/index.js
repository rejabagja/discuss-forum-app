import api from '@utils/api';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppError } from '@utils';
import { setAuthUser } from '@states/slices/auth-user';
import { setThreads } from '@states/slices/threads';
import { setUsers } from '@states/slices/users';
import { setCategories } from '@states/slices/categories';
import { setLeaderboards } from '@states/slices/leaderboards';
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

export const fetchPreloadData = createAsyncThunk('preload/fetchPreloadData', async (options = {}, thunkApi) => {
  const { dispatch, rejectWithValue, signal } = thunkApi;
  const { externalSignal } = options;
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
  'leaderboards/fetchLeaderboards',
  async (options = {}, thunkApi) => {
    const { rejectWithValue, dispatch, signal } = thunkApi;
    const { externalSignal } = options;
    try {
      dispatch(showLoading());
      const { data: { leaderboards } } = await api.getLeaderBoards({ signal: externalSignal || signal });
      dispatch(setLeaderboards(leaderboards));
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

export const fetchUsersThreads = createAsyncThunk(
  'combine/fetchUsersThreads',
  async (options = {}, thunkApi) => {
    const { dispatch, rejectWithValue, signal } = thunkApi;
    const { externalSignal } = options;
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