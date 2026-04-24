import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/wrapperComponents/Sidebar';
// import Header from '../components/wrapperComponents/Header';
import { useAppSelector } from '../hooks/useAppSelector';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const { sidebarToggle } = useAppSelector((state) => state.ui);

  return (
    <Box display='flex' height='100vh'>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarToggle} />

      {/* Main Area */}
      <Box
        flex={1}
        display='flex'
        flexDirection='column'
        sx={{
          transition: 'all 0.3s ease',
        }}
      >
        <Header />

        <Box
          component='main'
          flex={1}
          p={2}
          sx={{
            overflow: 'auto',
            bgcolor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
