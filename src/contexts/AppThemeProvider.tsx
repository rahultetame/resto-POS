import { CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect, type PropsWithChildren } from 'react';
import { appThemes } from '../config/theme';
import { useAppSelector } from '../hooks/useAppSelector';

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  return (
    <ThemeProvider theme={appThemes[themeMode]}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
