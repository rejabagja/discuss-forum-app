import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  data: [],
  selectedCategory: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCategories: (state, action) => {
      state.data = action.payload;
    },
  }
});


export const { setSelectedCategory, setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;