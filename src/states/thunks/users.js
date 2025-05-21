import React from 'react';
import api from '@utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { APIError } from '@utils';


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
