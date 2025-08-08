import { configureStore } from "@reduxjs/toolkit";
import nameReducer from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    name: nameReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;