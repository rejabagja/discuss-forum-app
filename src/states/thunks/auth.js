import api from '@utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthUser } from '@states/slices/auth';


export const registerUser = createAsyncThunk(
  'auth/register',
  async (payloads, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    const { payload, signal } = payloads;
    try {
      const { message, user } = await api.register(payload, { signal });
      return { message, user };
    } catch (error) {
      return rejectWithValue({
        name: error.name,
        message: error.name === 'AbortError' ? 'Registration request was aborted. Please try again.' : error.message,
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payloads, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;
    const { credentials, signal } = payloads;
    try {
      const { token } = await api.login(credentials, { signal });
      api.setAccessToken(token);
      const { user } = await api.getOwnProfile({ signal });
      dispatch(setAuthUser(user));
      return { user, message: 'Login successful' };
    } catch (error) {
      if (api.getAccessToken()) { // if fetch user fails, remove token
        api.removeAccessToken();
      }
      return rejectWithValue({
        name: error.name,
        message: error.name === 'AbortError' ? 'Login request was aborted. Please try again.' : error.message,
      });
    }
  }
);