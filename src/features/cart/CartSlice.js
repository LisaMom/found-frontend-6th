import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],       // { uuid, name, price, quantity, thumbnail }
  totalItems: 0,
  totalPrice: 0,
};

function recalculateTotals(state) {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // payload: { uuid, name, price, thumbnail, quantity? }
    addToCart: (state, action) => {
      const { uuid, name, price, thumbnail, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.uuid === uuid);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ uuid, name, price, thumbnail, quantity });
      }

      recalculateTotals(state);
    },

    // payload: uuid
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.uuid !== action.payload);
      recalculateTotals(state);
    },

    // payload: { uuid, quantity }
    updateQuantity: (state, action) => {
      const { uuid, quantity } = action.payload;
      const existing = state.items.find((item) => item.uuid === uuid);

      if (existing) {
        existing.quantity = Math.max(1, quantity);
      }

      recalculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  CartSlice.actions;
export default CartSlice.reducer;
