import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { clearAuthUser as clearAuth } from '@states/auth-user';
import api from '@utils/api';

export const loginUser = createAsyncThunk(
  'authUser/loginUser',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      dispatch(clearAuth());
      const { token } = await api.login(credentials);
      api.setAccessToken(token);
      const { user } = await api.getOwnProfile();
      return user;
    } catch (error) {
      return rejectWithValue(error.message || error || 'Login failed');
    } finally {
      dispatch(hideLoading());
    }
  }
);

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    clearAuthUser: (state) => {
      state.data = null;
      state.error = null;
      api.removeAccessToken('');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.data = null;
        state.error = action.payload;
      });
  },
});

export const { setAuthUser, clearAuthUser, clearError } = authUserSlice.actions;
export default authUserSlice.reducer;
