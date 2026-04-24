import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { SeatingConfig, TableShape, SpacingPreference, SeatDistribution } from '../store/types';
import { useLayoutStore, defaultSeatingConfig } from '../store/useLayoutStore';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const COLOR_INPUT_SX = {
  width: 44,
  height: 44,
  padding: 0,
  border: '2px solid #334155',
  borderRadius: '8px',
  cursor: 'pointer',
  background: 'none',
  '&:hover': { borderColor: '#64748b' },
};

const Step2SeatingConfig: React.FC<Props> = ({ onNext, onBack }) => {
  const { seatingConfig, setSeatingConfig } = useLayoutStore();

  const init = seatingConfig || defaultSeatingConfig;

  const [totalTables, setTotalTables] = useState<string>(String(init.totalTables));
  const [distribution, setDistribution] = useState<Record<keyof SeatDistribution, string>>({
    twoSeater: String(init.distribution.twoSeater),
    fourSeater: String(init.distribution.fourSeater),
    sixSeater: String(init.distribution.sixSeater),
    eightSeater: String(init.distribution.eightSeater),
    bar: String(init.distribution.bar),
  });
  const [tableShape, setTableShape] = useState<TableShape>(init.tableShape);
  const [spacing, setSpacing] = useState<SpacingPreference>(init.spacingPreference);
  const [labelPrefix, setLabelPrefix] = useState(init.labelPrefix);
  const [allowReservations, setAllowReservations] = useState(init.allowReservations);
  const [smokingAllowed, setSmokingAllowed] = useState(init.smokingAllowed);
  const [statusColors, setStatusColors] = useState(init.statusColors);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const distributionSum = () =>
    Object.values(distribution).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const total = Number(totalTables);
    if (!totalTables || isNaN(total) || total < 1) {
      newErrors.totalTables = 'Must be at least 1';
    } else if (total > 500) {
      newErrors.totalTables = 'Maximum 500 tables';
    }

    const distKeys: (keyof SeatDistribution)[] = [
      'twoSeater', 'fourSeater', 'sixSeater', 'eightSeater', 'bar',
    ];
    distKeys.forEach((key) => {
      const v = Number(distribution[key]);
      if (isNaN(v) || v < 0) newErrors[key] = 'Must be ≥ 0';
      else if (v > 500) newErrors[key] = 'Max 500';
    });

    if (!Object.keys(newErrors).some((k) => distKeys.includes(k as keyof SeatDistribution))) {
      const sum = distributionSum();
      if (sum !== total && !isNaN(total)) {
        newErrors.distributionSum = `Sum of distributions (${sum}) must equal total tables (${total})`;
      }
    }

    if (!labelPrefix.trim()) newErrors.labelPrefix = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setSubmitted(true);
    if (!validate()) return;

    const config: SeatingConfig = {
      totalTables: Number(totalTables),
      distribution: {
        twoSeater: Number(distribution.twoSeater),
        fourSeater: Number(distribution.fourSeater),
        sixSeater: Number(distribution.sixSeater),
        eightSeater: Number(distribution.eightSeater),
        bar: Number(distribution.bar),
      },
      tableShape,
      spacingPreference: spacing,
      labelPrefix,
      allowReservations,
      smokingAllowed,
      statusColors,
    };
    setSeatingConfig(config);
    onNext();
  };

  const distributionFields: { key: keyof SeatDistribution; label: string; seatsLabel: string }[] = [
    { key: 'twoSeater', label: '2-Seater', seatsLabel: '2 seats' },
    { key: 'fourSeater', label: '4-Seater', seatsLabel: '4 seats' },
    { key: 'sixSeater', label: '6-Seater', seatsLabel: '6 seats' },
    { key: 'eightSeater', label: '8-Seater', seatsLabel: '8 seats' },
    { key: 'bar', label: 'Bar Stool', seatsLabel: 'Bar seat' },
  ];

  const totalSum = distributionSum();
  const totalNum = Number(totalTables) || 0;
  const sumMatchesTotal = totalSum === totalNum;

  return (
    <Box>
      {/* Total Tables */}
      <Paper
        elevation={0}
        sx={{ p: 4, background: 'rgba(30,41,59,0.7)', border: '1px solid #334155', mb: 3 }}
      >
        <Typography variant="h5" sx={{ color: '#f1f5f9', mb: 1 }}>
          Seating Configuration
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
          Set the total table count and how they're distributed across seating types.
        </Typography>

        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Total Tables"
              type="number"
              value={totalTables}
              onChange={(e) => {
                setTotalTables(e.target.value);
                if (submitted) validate();
              }}
              error={!!errors.totalTables}
              helperText={errors.totalTables || 'Total tables in the restaurant'}
              inputProps={{ min: 1, max: 500 }}
              sx={{
                '& label': { color: '#94a3b8' },
                '& label.Mui-focused': { color: '#f97316' },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#f97316' },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Label Prefix"
              value={labelPrefix}
              onChange={(e) => setLabelPrefix(e.target.value)}
              error={!!errors.labelPrefix}
              helperText={errors.labelPrefix || 'e.g. T → T-01, T-02…'}
              sx={{
                '& label': { color: '#94a3b8' },
                '& label.Mui-focused': { color: '#f97316' },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#f97316' },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 2,
                background: sumMatchesTotal ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                border: `1px solid ${sumMatchesTotal ? '#4caf50' : '#f44336'}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Distribution Sum
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: sumMatchesTotal ? '#4caf50' : '#f44336', fontWeight: 700 }}
              >
                {totalSum} / {totalNum || '?'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {sumMatchesTotal ? '✓ Matches total' : 'Must equal total'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {errors.distributionSum && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.distributionSum}
          </Alert>
        )}
      </Paper>

      {/* Distribution */}
      <Paper
        elevation={0}
        sx={{ p: 4, background: 'rgba(30,41,59,0.7)', border: '1px solid #334155', mb: 3 }}
      >
        <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 0.5 }}>
          Table Distribution
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
          Allocate tables per seat type. The sum must equal the total above.
        </Typography>

        <Grid container spacing={2}>
          {distributionFields.map(({ key, label, seatsLabel }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
              <Box
                sx={{
                  p: 2.5,
                  background: 'rgba(15,23,42,0.5)',
                  border: `1px solid ${errors[key] ? '#f44336' : '#334155'}`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#f1f5f9', mb: 0.5 }}>
                  {label}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                  {seatsLabel}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={distribution[key]}
                  onChange={(e) => {
                    setDistribution((prev) => ({ ...prev, [key]: e.target.value }));
                    if (submitted) validate();
                  }}
                  error={!!errors[key]}
                  helperText={errors[key]}
                  inputProps={{ min: 0, max: 500 }}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#f97316' },
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Shape & Spacing */}
      <Paper
        elevation={0}
        sx={{ p: 4, background: 'rgba(30,41,59,0.7)', border: '1px solid #334155', mb: 3 }}
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
              Table Shape
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={tableShape}
              onChange={(_, v) => v && setTableShape(v)}
              sx={{ gap: 1, flexWrap: 'wrap' }}
            >
              {(['Round', 'Square', 'Rectangle'] as TableShape[]).map((shape) => (
                <ToggleButton
                  key={shape}
                  value={shape}
                  sx={{
                    color: '#94a3b8',
                    border: '1px solid #334155 !important',
                    borderRadius: '8px !important',
                    px: 3,
                    '&.Mui-selected': {
                      background: 'rgba(249,115,22,0.15)',
                      color: '#f97316',
                      borderColor: '#f97316 !important',
                    },
                  }}
                >
                  {shape === 'Round' ? '⭕' : shape === 'Square' ? '⬛' : '▬'}{' '}
                  {shape}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
              Spacing Preference
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={spacing}
              onChange={(_, v) => v && setSpacing(v)}
              sx={{ gap: 1, flexWrap: 'wrap' }}
            >
              {(['Compact', 'Standard', 'Spacious'] as SpacingPreference[]).map((s) => (
                <ToggleButton
                  key={s}
                  value={s}
                  sx={{
                    color: '#94a3b8',
                    border: '1px solid #334155 !important',
                    borderRadius: '8px !important',
                    px: 3,
                    '&.Mui-selected': {
                      background: 'rgba(99,102,241,0.15)',
                      color: '#818cf8',
                      borderColor: '#6366f1 !important',
                    },
                  }}
                >
                  {s}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: '#1e293b' }} />

        {/* Toggles */}
        <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 2 }}>
          Options
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{
                p: 2,
                background: 'rgba(15,23,42,0.5)',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#f1f5f9' }}>
                  Allow Reservations
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Enable table booking
                </Typography>
              </Box>
              <Switch
                checked={allowReservations}
                onChange={(e) => setAllowReservations(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#f97316' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#f97316',
                  },
                }}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{
                p: 2,
                background: 'rgba(15,23,42,0.5)',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#f1f5f9' }}>
                  Smoking Allowed
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Permit smoking in area
                </Typography>
              </Box>
              <Switch
                checked={smokingAllowed}
                onChange={(e) => setSmokingAllowed(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#f97316' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#f97316',
                  },
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Colors */}
      <Paper
        elevation={0}
        sx={{ p: 4, background: 'rgba(30,41,59,0.7)', border: '1px solid #334155', mb: 3 }}
      >
        <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 1 }}>
          Status Color Mapping
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
          Choose colors to represent each table status on the dashboard.
        </Typography>
        <Grid container spacing={2}>
          {(Object.entries(statusColors) as [keyof typeof statusColors, string][]).map(
            ([key, color]) => (
              <Grid size={{ xs: 6, sm: 3 }} key={key}>
                <Box
                  sx={{
                    p: 2,
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid #334155',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: color,
                      mx: 'auto',
                      mb: 1,
                      border: '2px solid rgba(255,255,255,0.15)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) =>
                        setStatusColors((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        border: 'none',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: '#94a3b8', textTransform: 'capitalize' }}
                  >
                    {key}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', display: 'block', fontSize: '0.65rem' }}>
                    {color}
                  </Typography>
                </Box>
              </Grid>
            )
          )}
        </Grid>
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          size="large"
          onClick={onBack}
          sx={{
            borderColor: '#334155',
            color: '#94a3b8',
            px: 4,
            py: 1.5,
            '&:hover': { borderColor: '#64748b', background: 'rgba(100,116,139,0.08)' },
          }}
        >
          ← Back
        </Button>
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
          Next: Layout Builder →
        </Button>
      </Box>
    </Box>
  );
};

export default Step2SeatingConfig;
