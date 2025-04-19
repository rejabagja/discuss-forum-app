import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';


export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showLoading());
    const { users } = await api.getUsers();
    return users;
  } catch (error) {
    return rejectWithValue(error);
  } finally {
    dispatch(hideLoading());
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => (action.payload));
  }
});

export default usersSlice.reducer;