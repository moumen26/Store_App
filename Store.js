import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "./features/CartSlice";

export const store = configureStore({
  reducer: {
    basket: basketReducer,
  },
});
