import React from 'react';
import api from '@utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

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
      return message;
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Request was aborted');
        return;
      }
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payloads, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    const { credentials } = payloads;
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