import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import uiReducer from './slices/uiSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    ui: uiReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
