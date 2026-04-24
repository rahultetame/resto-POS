import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import { useLayoutStore } from '../store/useLayoutStore';
import TableCard from '../components/TableCard';
import type { SavedRestaurantLayout } from '../store/types';

interface Props {
  onBack: () => void;
}

const Step4Preview: React.FC<Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const { areas, seatingConfig, layout, resetStore } = useLayoutStore();

  if (!seatingConfig) return null;

  const getStatusColor = (status: string) =>
    seatingConfig.statusColors[status as keyof typeof seatingConfig.statusColors] || '#4caf50';

  const handleFinish = () => {
    // Save once to localStorage on final submit
    const payload: SavedRestaurantLayout = {
      areas,
      seatingConfig,
      layout,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('restaurantLayout', JSON.stringify(payload));
    resetStore();
    navigate('/dashboard');
  };

  const tablesByArea = areas.map((area) => ({
    area,
    tables: layout.filter((t) => t.area === area.type),
  }));

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: 'rgba(30,41,59,0.7)',
          border: '1px solid #334155',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ color: '#f1f5f9' }}>
              Layout Preview
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Review your configuration before saving. Click Finish to save and go to the dashboard.
            </Typography>
          </Box>
        </Box>

        {/* Summary stats */}
        <Grid container spacing={2}>
          {[
            { label: 'Areas', value: areas.length },
            { label: 'Total Tables', value: layout.length },
            { label: 'Table Shape', value: seatingConfig.tableShape },
            { label: 'Spacing', value: seatingConfig.spacingPreference },
            { label: 'Reservations', value: seatingConfig.allowReservations ? 'Enabled' : 'Disabled' },
            { label: 'Smoking', value: seatingConfig.smokingAllowed ? 'Allowed' : 'Not Allowed' },
          ].map(({ label, value }) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={label}>
              <Box
                sx={{
                  p: 2,
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid #1e293b',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  {label}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#f97316', fontWeight: 700 }}>
                  {value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Status color legend */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: 'rgba(30,41,59,0.7)',
          border: '1px solid #334155',
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2 }}>
          STATUS COLORS
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Object.entries(seatingConfig.statusColors).map(([status, color]) => (
            <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: '#94a3b8', textTransform: 'capitalize' }}
              >
                {status}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Table preview by area */}
      {tablesByArea.map(({ area, tables }) => (
        <Paper
          key={area.type}
          elevation={0}
          sx={{
            p: 3,
            background: 'rgba(30,41,59,0.7)',
            border: '1px solid #334155',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#f97316', fontWeight: 700 }}>
              {area.type}
            </Typography>
            <Chip
              label={`${area.length}m × ${area.width}m`}
              size="small"
              sx={{ background: '#1e293b', color: '#64748b' }}
            />
            <Chip
              label={`${tables.length} tables`}
              size="small"
              sx={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}
            />
          </Box>

          {tables.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#475569', fontStyle: 'italic' }}>
              No tables placed in this area.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  statusColor={getStatusColor(table.status)}
                  size="md"
                />
              ))}
            </Box>
          )}
        </Paper>
      ))}

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
          startIcon={<SaveIcon />}
          onClick={handleFinish}
          sx={{
            background: 'linear-gradient(135deg, #4caf50, #388e3c)',
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 20px rgba(76,175,80,0.35)',
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #66bb6a, #4caf50)',
              boxShadow: '0 6px 24px rgba(76,175,80,0.5)',
            },
          }}
        >
          Finish & Save →
        </Button>
      </Box>
    </Box>
  );
};

export default Step4Preview;
