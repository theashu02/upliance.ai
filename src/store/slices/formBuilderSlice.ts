import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

/* ---------- types ---------- */
export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'derived';

export interface ValidationRules {
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
  options: string[];            // <── NEW : for select / radio / checkbox
  derivedParents: string[];
  derivedFormula: string;
}

interface BuilderState {
  fields: Field[];
  selectedId: string | null;
}

/* ---------- helpers ---------- */
const emptyRules: ValidationRules = {
  notEmpty: false,
  email: false,
  password: false,
};

const baseField = (type: FieldType): Field => ({
  id: nanoid(),
  type,
  label: type.toUpperCase(),
  required: false,
  defaultValue: '',
  validations: { ...emptyRules },
  options: [],
  derivedParents: [],
  derivedFormula: '',
});

/* ---------- slice ---------- */
const initialState: BuilderState = { fields: [], selectedId: null };

export const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<FieldType>) {
      const field = baseField(action.payload);
      state.fields.push(field);
      state.selectedId = field.id;
    },
    selectField(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    updateField(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Field> }>
    ) {
      const idx = state.fields.findIndex((f) => f.id === action.payload.id);
      if (idx >= 0) state.fields[idx] = { ...state.fields[idx], ...action.payload.changes };
    },
    removeField(state, action: PayloadAction<string>) {
      state.fields = state.fields.filter((f) => f.id !== action.payload);
      if (state.selectedId === action.payload) state.selectedId = null;
    },
    moveField(
      state,
      action: PayloadAction<{ id: string; direction: -1 | 1 }>
    ) {
      const { id, direction } = action.payload;
      const idx = state.fields.findIndex((f) => f.id === id);
      const swap = idx + direction;
      if (idx < 0 || swap < 0 || swap >= state.fields.length) return;
      [state.fields[idx], state.fields[swap]] = [state.fields[swap], state.fields[idx]];
    },
    resetBuilder() {
      return initialState;
    },
  },
});

export const {
  addField,
  selectField,
  updateField,
  removeField,
  moveField,
  resetBuilder,
} = formBuilderSlice.actions;
export default formBuilderSlice.reducer;