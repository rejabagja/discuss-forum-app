import { createSlice } from '@reduxjs/toolkit';
import { getInitialTheme } from '@utils';

const themeSlice = createSlice({
  name: 'theme',
  initialState: getInitialTheme(),
  reducers: {
    toggleTheme: (state) =>  {
      return state === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;