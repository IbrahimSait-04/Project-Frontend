import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
  
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += 1; 
      } else {
        state.cartItems.push({ ...newItem, quantity: 1 }); 
      }
    },

    removeFromCart: (state, action) => {
      const idToRemove = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== idToRemove);
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    
    updateQuantity: (state, action) => {
      const { id, type } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (!item) return;

      if (type === "inc") {
        item.quantity += 1;
      } else if (type === "dec" && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
