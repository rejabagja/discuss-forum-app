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
    setCategoriesData: (state, action) => {
      state.data = action.payload;
    },
  }
});


export const { setSelectedCategory, setCategoriesData } = categoriesSlice.actions;
export default categoriesSlice.reducer;