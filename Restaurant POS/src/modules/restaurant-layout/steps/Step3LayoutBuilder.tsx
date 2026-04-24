import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import type { LayoutTable, AreaType } from '../store/types';
import { useLayoutStore } from '../store/useLayoutStore';
import LayoutCanvas from '../components/LayoutCanvas';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const Step3LayoutBuilder: React.FC<Props> = ({ onNext, onBack }) => {
  const { areas, seatingConfig, layout, setLayout } = useLayoutStore();

  const [tables, setTables] = useState<LayoutTable[]>(layout);
  const [attempted, setAttempted] = useState(false);

  if (!seatingConfig) return null;

  const areaTypes: AreaType[] = areas.map((a) => a.type);

  // Check that each area has at least one table
  const areaValidation = areaTypes.map((area) => ({
    area,
    count: tables.filter((t) => t.area === area).length,
    valid: tables.filter((t) => t.area === area).length >= 1,
  }));

  const isValid = areaValidation.every((v) => v.valid);

  const handleTablesChange = useCallback((updated: LayoutTable[]) => {
    setTables(updated);
  }, []);

  const handleNext = () => {
    setAttempted(true);
    if (!isValid) return;
    setLayout(tables);
    onNext();
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: 'rgba(30,41,59,0.7)',
          border: '1px solid #334155',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: '#f1f5f9', mb: 0.5 }}>
              Layout Builder
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Drag table types from the sidebar and drop them onto each area canvas. At least one
              table is required per area.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Chip
              label={`${tables.length} tables placed`}
              sx={{
                background: tables.length > 0 ? 'rgba(76,175,80,0.15)' : 'rgba(100,116,139,0.15)',
                color: tables.length > 0 ? '#4caf50' : '#64748b',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Area validation status */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: attempted && !isValid ? 2 : 0 }}>
          {areaValidation.map(({ area, count, valid }) => (
            <Chip
              key={area}
              icon={
                valid ? (
                  <CheckCircleIcon sx={{ fontSize: 14, color: '#4caf50 !important' }} />
                ) : (
                  <ErrorOutlineIcon sx={{ fontSize: 14, color: '#ff9800 !important' }} />
                )
              }
              label={`${area}: ${count} table${count !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                background: valid ? 'rgba(76,175,80,0.1)' : 'rgba(255,152,0,0.1)',
                color: valid ? '#4caf50' : '#ff9800',
                border: `1px solid ${valid ? '#4caf50' : '#ff9800'}`,
              }}
            />
          ))}
        </Box>

        {attempted && !isValid && (
          <Alert
            severity="warning"
            sx={{ mt: 2, background: 'rgba(255,152,0,0.1)', color: '#ff9800', border: '1px solid #ff9800' }}
          >
            Each area needs at least one table. Areas marked in orange need tables.
          </Alert>
        )}
      </Paper>

      {/* Canvas */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: 'rgba(30,41,59,0.7)',
          border: '1px solid #334155',
          mb: 3,
          minHeight: 400,
        }}
      >
        <LayoutCanvas
          areas={areaTypes}
          tables={tables}
          tableShape={seatingConfig.tableShape}
          labelPrefix={seatingConfig.labelPrefix}
          statusColors={seatingConfig.statusColors as unknown as Record<string, string>}
          distribution={seatingConfig.distribution as unknown as Record<string, number>}
          onTablesChange={handleTablesChange}
        />
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
          disabled={attempted && !isValid}
          sx={{
            background: isValid
              ? 'linear-gradient(135deg, #f97316, #ea580c)'
              : undefined,
            px: 4,
            py: 1.5,
            boxShadow: isValid ? '0 4px 20px rgba(249,115,22,0.35)' : 'none',
            '&:hover': {
              background: isValid ? 'linear-gradient(135deg, #fb923c, #f97316)' : undefined,
            },
          }}
        >
          Next: Preview →
        </Button>
      </Box>
    </Box>
  );
};

export default Step3LayoutBuilder;
