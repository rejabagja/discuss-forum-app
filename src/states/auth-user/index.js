import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/api';

export const loginUser = createAsyncThunk(
  'authUser/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { token } = await api.login(credentials);
      api.setAccessToken(token);
      // add toast for success login
      const { user } = await api.getOwnProfile();
      return user;
    } catch (error) {
      return rejectWithValue(error.info());
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
        state.data = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setAuthUser, clearAuthUser, clearError } = authUserSlice.actions;
export default authUserSlice.reducer;
