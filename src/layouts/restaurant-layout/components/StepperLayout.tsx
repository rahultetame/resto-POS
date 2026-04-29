import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { useLayoutStore } from '../store/useLayoutStore';
import AreaForm from './AreaForm';
import LayoutCanvas from './LayoutCanvas';
import SeatingForm from './SeatingForm';
import Preview from './Preview';

const steps = [
  'Area Setup',
  'Seating Configuration',
  'Layout Builder',
  'Final Preview',
];

const StepperLayout = () => {
  const step = useLayoutStore((s) => s.step);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <AreaForm />;
      case 1:
        return <SeatingForm />;
      case 2:
        return <LayoutCanvas />;
      case 3:
        return <Preview />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ color: '#fff' }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>{renderStep()}</Box>
    </Box>
  );
};

export default StepperLayout;
