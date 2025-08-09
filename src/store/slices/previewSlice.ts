import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** (keep in-sync with builder) */
type FieldType =
  | 'text' | 'number' | 'textarea'
  | 'select' | 'radio' | 'checkbox'
  | 'date' | 'derived';

interface ValidationRules {
  notEmpty: boolean;
  minLength?: number;
  maxLength?: number;
  email: boolean;
  password: boolean;
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue: string;
  validations: ValidationRules;
  options?: string[];
  derivedParents: string[];
  derivedFormula: string;
}

interface PreviewState {
  forms: string[];
  activeForm: string | null;
  fields: Field[];
}

const initialState: PreviewState = { forms: [], activeForm: null, fields: [] };

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setForms: (state, { payload }: PayloadAction<string[]>) => {
      state.forms = payload;
    },
    openForm: (
      state,
      { payload }: PayloadAction<{ name: string; fields: Field[] }>
    ) => {
      state.activeForm = payload.name;
      state.fields = payload.fields;
    },
    closeForm: () => initialState,
  },
});

export const { setForms, openForm, closeForm } = previewSlice.actions;
export default previewSlice.reducer;