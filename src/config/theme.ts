import { createTheme } from '@mui/material/styles';

export type AppThemeMode = 'light' | 'dark' | 'pos' | 'kiosk';
type MuiPaletteMode = 'light' | 'dark';

const commonTypography = {
  fontFamily:
    'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  button: {
    textTransform: 'none' as const,
    fontWeight: 700,
  },
};

const makeTheme = (
  mode: MuiPaletteMode,
  primary: string,
  secondary: string,
  background: string,
  paper: string,
) =>
  createTheme({
    palette: {
      mode,
      primary: { main: primary },
      secondary: { main: secondary },
      background: { default: background, paper },
    },
    shape: {
      borderRadius: 8,
    },
    typography: commonTypography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

export const appThemes = {
  light: makeTheme('light', '#2563eb', '#16a34a', '#f7f8fb', '#ffffff'),
  dark: makeTheme('dark', '#60a5fa', '#34d399', '#0f172a', '#182235'),
  pos: makeTheme('light', '#e11d48', '#0f766e', '#fff7ed', '#ffffff'),
  kiosk: makeTheme('dark', '#7c3aed', '#06b6d4', '#050816', '#10162a'),
} satisfies Record<AppThemeMode, ReturnType<typeof createTheme>>;
