
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count : 0 //initialize value 
}

export const CounterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    //  increment 
    increment: (state) => {
      state.count +=1;
    },
    // decrement 
    decrement: (state) => {
      state.count = state.count <= 0 ? 0 : state.count - 1;
    }
  }
})

export const {increment, decrement} = CounterSlice.actions;
export default CounterSlice.reducer;
