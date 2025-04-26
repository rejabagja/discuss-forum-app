import api from '@utils/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


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
    // make toast when user is created
    alert(message);
    return user;
  } catch (error) {
    return rejectWithValue(error.info());
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