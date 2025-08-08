import { configureStore } from "@reduxjs/toolkit";
import nameReducer from "./slices/userSlice"
import formBuilderReducer from './slices/formBuilderSlice';

export const store = configureStore({
  reducer: {
    name: nameReducer,
    formBuilder: formBuilderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;