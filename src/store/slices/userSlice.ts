import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Redux state for a single name value */
export interface NameState {
  value: string;
}

const initialState: NameState = {
  value: '',
};

const nameSlice = createSlice({
  name: 'name',         
  initialState,
  reducers: {
    /** Set / replace the stored name */
    setName(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    /** Reset name to an empty string */
    clearName(state) {
      state.value = '';
    },
  },
});

export const { setName, clearName } = nameSlice.actions;
export default nameSlice.reducer;