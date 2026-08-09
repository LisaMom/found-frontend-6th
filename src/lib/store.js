import { configureStore } from "@reduxjs/toolkit";
import { CounterSlice } from "../features/counter/CounterSlice";
import { CartSlice } from "../features/cart/CartSlice";
import authReducer, { authSlice } from "../features/auth/authSlice";
import { baseApi } from "../services/baseApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authSlice.name]: authReducer,
      [CounterSlice.name]: CounterSlice.reducer,
      [CartSlice.name]: CartSlice.reducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export const store = makeStore();

