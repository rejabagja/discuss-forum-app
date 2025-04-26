import { createSlice } from '@reduxjs/toolkit';


const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    data: [],
    selectedCategory: null
  },
  reducers: {
    setCategories: (state, action) => {
      state.data = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});


export const { setCategories, setSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;