import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Button, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppThemeMode } from '../config/theme';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logout } from '../store/slices/loginSlice';
import { PATH } from '../routes/path';
import DateBadge from '../components/date/DateBadge';
import { setThemeMode } from '../store/slices/uiSlice';
import { CustomButton } from '../components/form';
// import type { AppThemeMode } from '../../config/theme';
// import { CustomButton } from '../form';
// import DateBadge from '../date/DateBadge';
// import { useAppDispatch, useAppSelector } from '../../hooks';
// import { logout } from '../../store/slices/loginSlice';
// import { setThemeMode } from '../../store/slices/uiSlice';
// import { PATH } from '../../routes/path';

const themeOptions: AppThemeMode[] = ['light', 'dark', 'pos', 'kiosk'];

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { themeMode } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      px={2}
      height={64}
      borderBottom='1px solid #e5e7eb'
      bgcolor='background.paper'
    >
      <DateBadge />

      <Box display='flex' alignItems='center' gap={2}>
        <Button
          variant='contained'
          color='error'
          onClick={() => navigate(PATH.RESTAURANT_LAYOUT)}
        >
          Setup Restaurant
        </Button>
        <Select
          size='small'
          value={themeMode}
          onChange={(e) =>
            dispatch(setThemeMode(e.target.value as AppThemeMode))
          }
        >
          {themeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option.toUpperCase()}
            </MenuItem>
          ))}
        </Select>

        <CustomButton
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          variant='outlined'
        >
          Logout
        </CustomButton>
      </Box>
    </Box>
  );
};

export default Header;
