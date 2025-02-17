import { createSlice } from '@reduxjs/toolkit';


interface AuthState {
  user: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: 'loki',
  token: '1234567890',
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
