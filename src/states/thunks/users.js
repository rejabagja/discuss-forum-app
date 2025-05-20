import React from 'react';
import api from '@utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { APIError } from '@utils';


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (signal) => {
    try {
      const { data: { users } } = await api.getUsers({ signal });
      return users;
    } catch (error) {
      console.dir(error);
      if (error.name === 'AbortError') {
        throw new APIError('Request aborted', 408);
      }
      throw error;
      // return rejectWithValue(error.info());
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { user, message } = await api.register(credentials);
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
      return user;
    } catch (error) {
      return rejectWithValue(error.info());
    }
  }
);
