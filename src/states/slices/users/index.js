import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  data: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersData: (state, action) => {
      state.data = action.payload;
    },
  }
});

export const { setUsersData } = usersSlice.actions;
export default usersSlice.reducer;