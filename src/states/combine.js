import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers } from './users';
import { fetchThreads } from './threads';
import { showLoading, hideLoading } from 'react-redux-loading-bar';


export const fetchUsersThreads = createAsyncThunk('combine/fetchUsersThreads', async (_, { dispatch }) => {
  try {
    dispatch(showLoading());
    // await dispatch(fetchUsers());
    // await dispatch(fetchThreads());
    await Promise.all([dispatch(fetchUsers()), dispatch(fetchThreads())]);
    return true;
  } catch (error) {
    console.log(error?.message || error);
    return false;
  } finally {
    dispatch(hideLoading());
  }
});