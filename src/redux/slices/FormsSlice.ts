import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Form {
  id: string;
  title: string;
  fields: { label: string; type: string }[];
}

interface FormsState {
  forms: Form[];
}

const initialState: FormsState = { forms: [] };

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<Form>) => {
      state.forms.push(action.payload);
    },
  },
});

export const { addForm } = formsSlice.actions;
export default formsSlice.reducer;
