import { Box, Button, Typography } from '@mui/material';
import { useLayoutStore } from '../store/useLayoutStore';

const Header = () => {
  const setStep = useLayoutStore((s) => s.setStep);

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      mb={2}
    >
      <Typography variant='h5' fontWeight={700}>
        Restaurant Layout Config
      </Typography>

      <Button variant='contained' color='error' onClick={() => setStep(0)}>
        Setup Restaurant
      </Button>
    </Box>
  );
};

export default Header;
