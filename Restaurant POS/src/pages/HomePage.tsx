import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const hasSavedLayout = Boolean(localStorage.getItem('restaurantLayout'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'rgba(30,41,59,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #334155',
          }}
        >
          {/* Logo / Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 0 40px rgba(249,115,22,0.3)',
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Box>

          <Typography variant="h4" sx={{ color: '#f1f5f9', mb: 1 }}>
            Restaurant POS
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
            Configure your restaurant layout and manage tables in real-time.
          </Typography>

          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SettingsIcon />}
              onClick={() => navigate('/setup')}
              sx={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                py: 1.5,
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #fb923c, #f97316)',
                  boxShadow: '0 6px 24px rgba(249,115,22,0.5)',
                },
              }}
            >
              Setup Restaurant
            </Button>

            {hasSavedLayout && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderColor: '#f97316',
                  color: '#f97316',
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#fb923c',
                    background: 'rgba(249,115,22,0.08)',
                  },
                }}
              >
                View Dashboard
              </Button>
            )}
          </Stack>

          {hasSavedLayout && (
            <Typography variant="caption" sx={{ color: '#64748b', mt: 2, display: 'block' }}>
              A saved layout exists. Setup will overwrite it.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
