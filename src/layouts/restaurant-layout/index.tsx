import { Box } from '@mui/material';
import Header from './components/Header';
import StepperLayout from './components/StepperLayout';

const RestaurantLayoutModule = () => {
  return (
    <Box
      sx={{
        p: 3,
        background: '#2f3136',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <Header />
      <StepperLayout />
    </Box>
  );
};

export default RestaurantLayoutModule;
