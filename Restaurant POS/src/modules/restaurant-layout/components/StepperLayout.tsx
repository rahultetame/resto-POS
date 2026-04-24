import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const STEPS = [
  'Area Selection',
  'Seating Config',
  'Layout Builder',
  'Preview & Finish',
];

interface StepperLayoutProps {
  activeStep: number;
  children: React.ReactNode;
}

const StepperLayout: React.FC<StepperLayoutProps> = ({ activeStep, children }) => {
  const progress = ((activeStep) / (STEPS.length - 1)) * 100;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          borderBottom: '1px solid #334155',
          background: 'rgba(30,41,59,0.95)',
          backdropFilter: 'blur(8px)',
          px: 4,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RestaurantMenuIcon sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700 }}>
          Restaurant Setup
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          Step {activeStep + 1} of {STEPS.length}
        </Typography>
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3,
          backgroundColor: '#1e293b',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #f97316, #ea580c)',
          },
        }}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 4 }, gap: 3 }}>
        {/* Stepper */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: 'rgba(30,41,59,0.6)',
            border: '1px solid #334155',
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label, idx) => (
              <Step key={label} completed={idx < activeStep}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: idx === activeStep ? '#f97316' : idx < activeStep ? '#4caf50' : '#64748b',
                      fontWeight: idx === activeStep ? 700 : 400,
                    },
                    '& .MuiStepIcon-root': {
                      color: idx < activeStep ? '#4caf50' : idx === activeStep ? '#f97316' : '#334155',
                    },
                    '& .MuiStepIcon-root.Mui-active': { color: '#f97316' },
                    '& .MuiStepIcon-root.Mui-completed': { color: '#4caf50' },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step content */}
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default StepperLayout;
