import { configureStore } from '@reduxjs/toolkit'
import { CounterSlice } from '../features/counter/CounterSlice'
import { CartSlice } from '../features/cart/CartSlice'
import { ecommerceApi } from '../services/ecommerceApi'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [CounterSlice.name]: CounterSlice.reducer,
      [CartSlice.name]: CartSlice.reducer,
      [ecommerceApi.reducerPath]: ecommerceApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(ecommerceApi.middleware)
  })
}

export const store = makeStore()
