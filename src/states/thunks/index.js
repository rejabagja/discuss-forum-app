import api from '@utils/api';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';


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