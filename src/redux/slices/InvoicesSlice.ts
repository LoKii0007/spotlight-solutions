import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  status: 'pending' | 'paid';
}

interface InvoicesState {
  invoices: Invoice[];
}

const initialState: InvoicesState = { invoices: [] };

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.push(action.payload);
    },
    updateInvoiceStatus: (state, action: PayloadAction<{ id: string, status: 'pending' | 'paid' }>) => {
      const invoice = state.invoices.find(inv => inv.id === action.payload.id);
      if (invoice) invoice.status = action.payload.status;
    },
  },
});

export const { addInvoice, updateInvoiceStatus } = invoicesSlice.actions;
export default invoicesSlice.reducer;
