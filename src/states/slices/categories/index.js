import { createSlice } from '@reduxjs/toolkit';
import { fetchThreads } from '@states/thunks/threads';


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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        const threads = action.payload;
        const categories = [
          ...new Set(threads.map((thread) => thread.category)),
        ];
        state.data = categories;
      });
  },
});


export const { setSelectedCategory, setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;