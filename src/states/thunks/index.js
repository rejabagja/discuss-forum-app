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
    const { user } = await api.getOwnProfile();
    return user;
  } catch (error) {
    console.error(error.message);
  }
});