import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'



export const Store = configureStore({
    reducer: {
        cart: cartReducer

    }
})