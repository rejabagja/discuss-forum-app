import api from '@utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppError } from '@utils';
import { setAuthUser } from '@states/slices/auth';
import { setThreadsData } from '@states/slices/threads';
import { setUsersData } from '@states/slices/users';
import { setCategoriesData } from '@states/slices/categories';
import { setLeaderboardsData } from '@states/slices/leaderboards';
import { hideLoading, showLoading } from 'react-redux-loading-bar';


export const fetchPreloadData = createAsyncThunk('preload/fetchPreloadData', async (options = {}, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  const { signal } = options;
  const token = api.getAccessToken();
  try {
    dispatch(showLoading());
    if (!token) {
      throw new AppError('access token not found', 401);
    }
    const { user } = await api.getOwnProfile({ signal });
    dispatch(setAuthUser(user));
  } catch (error) {
    if (error.statusCode === 401) {
      if (error.name !== 'AppError') api.removeAccessToken(); // if token exists, remove it
      return;
    }
    return rejectWithValue(
      {
        name: error.name,
        message: error.name === 'AbortError' ? 'Request was aborted' : error.message,
        statusCode: error.name === 'AbortError' ? 408 : error.statusCode,
      }
    );
  } finally {
    dispatch(hideLoading());
  }
});

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/fetchLeaderboards',
  async (options = {}, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;
    const { signal } = options;
    try {
      dispatch(showLoading());
      const { leaderboards } = await api.getLeaderBoards({ signal });
      dispatch(setLeaderboardsData(leaderboards));
    } catch (error) {
      return rejectWithValue({
        name: error.name,
        message: error.name === 'AbortError' ? 'Request was aborted' : error.message,
        statusCode: error.name === 'AbortError' ? 408 : error.statusCode,
      });
    } finally {
      dispatch(hideLoading());
    }
  }
);

export const fetchUsersThreads = createAsyncThunk(
  'combine/fetchUsersThreads',
  async (options = {}, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    const { signal } = options;
    try {
      dispatch(showLoading());
      const [threadsResult, usersResult] = await Promise.all([
        api.getThreads({ signal }),
        api.getUsers({ signal }),
      ]);

      const { threads } = threadsResult;
      const { users } = usersResult;

      const categories = [...new Set(threads.map((thread) => thread.category))];
      dispatch(setCategoriesData(categories));
      dispatch(setUsersData(users));
      dispatch(setThreadsData(threads));
    } catch (error) {
      return rejectWithValue({
        name: error.name,
        message: error.name === 'AbortError' ? 'Request was aborted' : error.message,
        statusCode: error.name === 'AbortError' ? 408 : error.statusCode,
      });
    } finally {
      dispatch(hideLoading());
    }
  }
);