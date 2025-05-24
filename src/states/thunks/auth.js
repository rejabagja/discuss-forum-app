import React from 'react';
import api from '@utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { setAuthUser } from '@states/slices/auth';


export const registerUser = createAsyncThunk(
  'auth/register',
  async (payloads, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    const { payload, signal } = payloads;
    try {
      const { message } = await api.register(payload, {
        signal: signal || thunkApi.signal,
      });
      const toastContent = React.createElement(
        'div',
        null,
        `${message} successfully. `,
        React.createElement(
          Link,
          { to: '/login', className: 'text-blue-500 underline' },
          'Login here'
        )
      );
      toast.success(toastContent);
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Request was aborted');
        error.message = '';
      }
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payloads, thunkApi) => {
    const { rejectWithValue, dispatch, getState } = thunkApi;
    const { credentials, signal } = payloads;
    try {
      const { token } = await api.login(credentials, { signal: signal || thunkApi.signal });
      api.setAccessToken(token);
      const { user } = await api.getOwnProfile({ signal: signal || thunkApi.signal });
      dispatch(setAuthUser(user));
      const authedUser = getState().auth.user;
      toast.success(`Welcome back, ${authedUser.name}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Request was aborted');
        error.message = '';
      }
      return rejectWithValue(error.message);
    }
  }
);