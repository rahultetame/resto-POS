import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import type { Area, AreaType } from '../store/types';
import { useLayoutStore } from '../store/useLayoutStore';

const AREA_TYPES: { type: AreaType; icon: string; description: string }[] = [
  { type: 'Indoor', icon: '🏠', description: 'Main dining hall' },
  { type: 'Outdoor', icon: '🌿', description: 'Garden / patio area' },
  { type: 'Bar', icon: '🍸', description: 'Bar & cocktail zone' },
  { type: 'Private Dining', icon: '🚪', description: 'Private rooms' },
  { type: 'Terrace', icon: '☀️', description: 'Rooftop / terrace' },
  { type: 'Lounge', icon: '🛋️', description: 'Lounge & waiting area' },
];

interface FieldErrors {
  length?: string;
  width?: string;
}

interface AreaErrors {
  [key: string]: FieldErrors;
}

interface Props {
  onNext: () => void;
}

const Step1AreaSelection: React.FC<Props> = ({ onNext }) => {
  const { areas, setAreas } = useLayoutStore();

  const [selectedTypes, setSelectedTypes] = useState<AreaType[]>(
    areas.map((a) => a.type)
  );
  const [dimensions, setDimensions] = useState<Record<AreaType, { length: string; width: string }>>(
    () => {
      const init = {} as Record<AreaType, { length: string; width: string }>;
      AREA_TYPES.forEach(({ type }) => {
        const existing = areas.find((a) => a.type === type);
        init[type] = {
          length: existing ? String(existing.length) : '',
          width: existing ? String(existing.width) : '',
        };
      });
      return init;
    }
  );
  const [errors, setErrors] = useState<AreaErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleArea = (type: AreaType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    // Clear errors when toggling
    setErrors((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  const handleDimensionChange = (
    type: AreaType,
    field: 'length' | 'width',
    value: string
  ) => {
    setDimensions((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
    if (submitted) {
      validateField(type, field, value);
    }
  };

  const validateField = (type: AreaType, field: 'length' | 'width', value: string): string => {
    if (!value || value.trim() === '') return 'Required';
    const num = Number(value);
    if (isNaN(num) || !Number.isFinite(num)) return 'Must be a number';
    if (num < 1) return 'Minimum 1m';
    if (num > 500) return 'Maximum 500m';
    return '';
  };

  const validate = (): boolean => {
    if (selectedTypes.length === 0) return false;

    const newErrors: AreaErrors = {};
    let valid = true;

    for (const type of selectedTypes) {
      const fieldErrors: FieldErrors = {};
      const lenErr = validateField(type, 'length', dimensions[type].length);
      const widErr = validateField(type, 'width', dimensions[type].width);
      if (lenErr) { fieldErrors.length = lenErr; valid = false; }
      if (widErr) { fieldErrors.width = widErr; valid = false; }
      if (Object.keys(fieldErrors).length > 0) newErrors[type] = fieldErrors;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    setSubmitted(true);
    if (selectedTypes.length === 0) return;
    if (!validate()) return;

    const builtAreas: Area[] = selectedTypes.map((type) => ({
      type,
      length: Number(dimensions[type].length),
      width: Number(dimensions[type].width),
    }));
    setAreas(builtAreas);
    onNext();
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: 'rgba(30,41,59,0.7)',
          border: '1px solid #334155',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: '#f1f5f9', mb: 1 }}>
          Select Area Types
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
          Choose one or more areas for your restaurant. You'll configure dimensions for each.
        </Typography>

        {submitted && selectedTypes.length === 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please select at least one area type.
          </Alert>
        )}

        <Grid container spacing={2}>
          {AREA_TYPES.map(({ type, icon, description }) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={type}>
                <Paper
                  onClick={() => toggleArea(type)}
                  sx={{
                    p: 2.5,
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #f97316' : '2px solid #334155',
                    background: isSelected
                      ? 'rgba(249,115,22,0.08)'
                      : 'rgba(15,23,42,0.5)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      border: `2px solid ${isSelected ? '#fb923c' : '#64748b'}`,
                      background: isSelected
                        ? 'rgba(249,115,22,0.12)'
                        : 'rgba(100,116,139,0.08)',
                    },
                    position: 'relative',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Typography sx={{ fontSize: 28 }}>{icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: isSelected ? '#f97316' : '#f1f5f9', fontWeight: 600 }}
                      >
                        {type}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {description}
                      </Typography>
                    </Box>
                    {isSelected ? (
                      <CheckCircleIcon sx={{ color: '#f97316', fontSize: 20 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ color: '#475569', fontSize: 20 }} />
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Dimensions for selected areas */}
      {selectedTypes.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'rgba(30,41,59,0.7)',
            border: '1px solid #334155',
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 1 }}>
            Area Dimensions
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            Enter length and width (in meters) for each selected area. Range: 1–500m.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {selectedTypes.map((type, idx) => {
              const areaInfo = AREA_TYPES.find((a) => a.type === type)!;
              const areaErrors = errors[type] || {};
              return (
                <Box key={type}>
                  {idx > 0 && <Divider sx={{ mb: 3, borderColor: '#1e293b' }} />}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography sx={{ fontSize: 20 }}>{areaInfo.icon}</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#f97316', fontWeight: 600 }}>
                      {type}
                    </Typography>
                    <Chip
                      label={`Area ${idx + 1}`}
                      size="small"
                      sx={{ ml: 1, background: '#334155', color: '#94a3b8', fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Length (m)"
                        type="number"
                        value={dimensions[type].length}
                        onChange={(e) => handleDimensionChange(type, 'length', e.target.value)}
                        error={!!areaErrors.length}
                        helperText={areaErrors.length || 'Min 1m – Max 500m'}
                        inputProps={{ min: 1, max: 500, step: 0.5 }}
                        sx={{
                          '& label': { color: '#94a3b8' },
                          '& label.Mui-focused': { color: '#f97316' },
                          '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#f97316' },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Width (m)"
                        type="number"
                        value={dimensions[type].width}
                        onChange={(e) => handleDimensionChange(type, 'width', e.target.value)}
                        error={!!areaErrors.width}
                        helperText={areaErrors.width || 'Min 1m – Max 500m'}
                        inputProps={{ min: 1, max: 500, step: 0.5 }}
                        sx={{
                          '& label': { color: '#94a3b8' },
                          '& label.Mui-focused': { color: '#f97316' },
                          '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#f97316' },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleNext}
          sx={{
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
            '&:hover': { background: 'linear-gradient(135deg, #fb923c, #f97316)' },
          }}
        >
          Next: Seating Config →
        </Button>
      </Box>
    </Box>
  );
};

export default Step1AreaSelection;
