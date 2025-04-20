import api from '@utils/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { clearError as clearUsersError } from '@states/users';


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

export const createUser = createAsyncThunk('users/createUser', async (credentials, { rejectWithValue, dispatch }) => {
  try {
    dispatch(clearUsersError());
    const { user } = await api.register(credentials);
    // make toast when user is created
    alert('User created successfully');
    return user;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.data = [];
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;