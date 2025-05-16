import { createSlice } from '@reduxjs/toolkit';


export const getInitialTheme = () => {
  const theme = localStorage.getItem('theme');
  return theme === 'dark' || theme === 'light' ? theme : 'light';
};

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