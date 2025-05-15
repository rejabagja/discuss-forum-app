import api from '@utils/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React from 'react';


export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const { users } = await api.getUsers();
    return users;
  } catch (error) {
    return rejectWithValue(error.info());
  }
});

export const createUser = createAsyncThunk('users/createUser', async (credentials, { rejectWithValue }) => {
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
});

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;