import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { useLayoutStore } from '../store/useLayoutStore';

const areaTypes = ['Indoor', 'Outdoor', 'Bar'];

const AreaForm = () => {
  const setAreas = useLayoutStore((s) => s.setAreas);
  const setStep = useLayoutStore((s) => s.setStep);

  const [areas, setLocalAreas] = useState<any[]>([]);

  const handleAdd = () => {
    setLocalAreas([...areas, { type: '', length: '', width: '' }]);
  };

  const handleChange = (i: number, key: string, value: any) => {
    const updated = [...areas];
    updated[i][key] = value;
    setLocalAreas(updated);
  };

  const handleNext = () => {
    setAreas(areas);
    setStep(1);
  };

  return (
    <Box>
      <Button onClick={handleAdd}>Add Area</Button>

      {areas.map((area, i) => (
        <Grid container spacing={2} key={i} mt={1}>
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              label='Type'
              value={area.type}
              onChange={(e) => handleChange(i, 'type', e.target.value)}
            >
              {areaTypes.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={4}>
            <TextField
              label='Length'
              type='number'
              fullWidth
              value={area.length}
              onChange={(e) => handleChange(i, 'length', +e.target.value)}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label='Width'
              type='number'
              fullWidth
              value={area.width}
              onChange={(e) => handleChange(i, 'width', +e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

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

export default AreaForm;
