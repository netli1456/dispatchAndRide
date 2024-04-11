import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
  name: 'searchproducts',
  initialState: {
    searchproducts: [],
  },
  reducers: {
    searchSuccess: (state, action) => {
      state.searchproducts = action.payload;
      
      
      
    },
  },
});

export const { searchSuccess } = searchSlice.actions;
export default searchSlice.reducer;
