import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppThemeMode } from '../../config/theme';

type UiState = {
  themeMode: AppThemeMode;
  sidebarToggle: boolean;
  loading: boolean;
};

const initialState: UiState = {
  themeMode: 'light',
  sidebarToggle: false,
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<AppThemeMode>) => {
      state.themeMode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarToggle = !state.sidebarToggle;
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebarToggle = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setThemeMode, toggleSidebar, setSidebar, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
