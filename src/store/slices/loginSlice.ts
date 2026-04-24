import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storage, type StoredUser } from '../../utils/storage';

type LoginState = {
  token: string | null;
  userDetails: StoredUser | null;
};

const initialState: LoginState = {
  token: storage.getToken(),
  userDetails: storage.getUser(),
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ token: string; userDetails: StoredUser }>) => {
      state.token = action.payload.token;
      state.userDetails = action.payload.userDetails;
      storage.setToken(action.payload.token);
      storage.setUser(action.payload.userDetails);
    },
    logout: (state) => {
      state.token = null;
      state.userDetails = null;
      storage.clearToken();
      storage.clearUser();
    },
  },
});

export const { setToken, logout } = loginSlice.actions;
export default loginSlice.reducer;
