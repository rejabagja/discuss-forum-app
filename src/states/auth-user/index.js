import api from '@utils/api';
import { toast } from 'react-toastify';
import { preloadProcess } from '@states/preload';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
  'authUser/login',
  async (credentials, { rejectWithValue }) => {
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

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.data = action.payload;
    },
    clearAuthUser: () => {
      api.removeAccessToken('');
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(preloadProcess.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { setAuthUser, clearAuthUser, clearError } = authUserSlice.actions;
export default authUserSlice.reducer;
