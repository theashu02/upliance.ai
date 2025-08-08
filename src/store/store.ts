import { configureStore } from "@reduxjs/toolkit";
import nameReducer from "./slices/userSlice"
import formBuilderReducer from './slices/formBuilderSlice';
import previewReducer from './slices/previewSlice';

export const store = configureStore({
  reducer: {
    name: nameReducer,
    formBuilder: formBuilderReducer,
    preview: previewReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;