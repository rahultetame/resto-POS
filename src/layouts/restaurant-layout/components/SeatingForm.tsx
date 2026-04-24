import { Box, Button, Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { useLayoutStore } from '../store/useLayoutStore';

const SeatingForm = () => {
  const setStep = useLayoutStore((s) => s.setStep);
  const setSeating = useLayoutStore((s) => s.setSeating);

  const [form, setForm] = useState({
    totalTables: 0,
    two: 0,
    four: 0,
    six: 0,
  });

  const handleNext = () => {
    const total = form.two + form.four + form.six;

    if (total !== form.totalTables) {
      alert('Mismatch in table count');
      return;
    }

    setSeating(form);
    setStep(2);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {Object.keys(form).map((key) => (
          <Grid item xs={4} key={key}>
            <TextField
              label={key}
              type='number'
              fullWidth
              value={(form as any)[key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: +e.target.value,
                })
              }
            />
          </Grid>
        ))}
      </Grid>

      <Button
        variant='contained'
        color='error'
        sx={{ mt: 3 }}
        onClick={handleNext}
      >
        Next
      </Button>
    </Box>
  );
};

export default SeatingForm;
