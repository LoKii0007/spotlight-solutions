

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import clientsReducer from './slices/ClientSlice';
import invoicesReducer from './slices/InvoicesSlice';
import formsReducer from './slices/FormsSlice';
import boardReducer from './slices/BoardSlice';
// import { apiSlice } from './api/apiSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    invoices: invoicesReducer,
    forms: formsReducer,
    boards: boardReducer,
    //  [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),


});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
