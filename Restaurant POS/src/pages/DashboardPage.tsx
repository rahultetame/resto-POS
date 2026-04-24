import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import type { SavedRestaurantLayout, LayoutTable, AreaType } from '../modules/restaurant-layout/store/types';
import TableCard from '../modules/restaurant-layout/components/TableCard';

// ─── Table Detail Modal ───────────────────────────────────────────────────────
interface TableDetailModalProps {
  table: LayoutTable | null;
  statusColor: string;
  onClose: () => void;
}

const TableDetailModal: React.FC<TableDetailModalProps> = ({ table, statusColor, onClose }) => {
  if (!table) return null;

  const details = [
    { label: 'Table ID', value: table.id.split('-').slice(-1)[0] },
    { label: 'Label', value: table.label },
    { label: 'Status', value: table.status },
    { label: 'Seats', value: table.seats === 0 ? 'Bar Stool' : String(table.seats) },
    { label: 'Area', value: table.area },
    { label: 'Shape', value: table.shape },
    { label: 'Position', value: `(${table.x}, ${table.y})` },
    { label: 'Duration', value: table.duration ? `${table.duration} min` : '—' },
  ];

  return (
    <Dialog
      open={!!table}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1,
          borderBottom: '1px solid #334155',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: table.shape === 'Round' ? '50%' : table.shape === 'Square' ? 1 : 0.5,
            background: `${statusColor}22`,
            border: `2px solid ${statusColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: '0.6rem', color: statusColor, fontWeight: 700 }}>
            {table.seats === 0 ? 'B' : table.seats}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: '#f1f5f9', lineHeight: 1.2 }}>
            {table.label}
          </Typography>
          <Chip
            label={table.status}
            size="small"
            sx={{
              height: 18,
              background: `${statusColor}22`,
              color: statusColor,
              border: `1px solid ${statusColor}`,
              textTransform: 'capitalize',
              fontSize: '0.65rem',
            }}
          />
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {details.map(({ label, value }) => (
            <Box
              key={label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 0.75,
                borderBottom: '1px solid #0f172a',
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: label === 'Status' ? statusColor : '#f1f5f9',
                  fontWeight: label === 'Label' ? 700 : 400,
                  textTransform: label === 'Status' ? 'capitalize' : 'none',
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #334155' }}>
        <Button
          onClick={onClose}
          sx={{ color: '#94a3b8', '&:hover': { background: 'rgba(148,163,184,0.08)' } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Area Section ─────────────────────────────────────────────────────────────
interface AreaSectionProps {
  areaName: AreaType;
  tables: LayoutTable[];
  statusColors: Record<string, string>;
  onTableClick: (table: LayoutTable) => void;
}

const AreaSection: React.FC<AreaSectionProps> = ({
  areaName,
  tables,
  statusColors,
  onTableClick,
}) => {
  const getStatusColor = (status: string) =>
    statusColors[status] || '#4caf50';

  const statusCounts = tables.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: 'rgba(30,41,59,0.6)',
        border: '1px solid #334155',
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <GridViewIcon sx={{ color: '#f97316', fontSize: 20 }} />
        <Typography variant="h6" sx={{ color: '#f97316', fontWeight: 700 }}>
          {areaName}
        </Typography>
        <Chip
          label={`${tables.length} tables`}
          size="small"
          sx={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}
        />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <Chip
              key={status}
              label={`${count} ${status}`}
              size="small"
              sx={{
                height: 20,
                background: `${getStatusColor(status)}18`,
                color: getStatusColor(status),
                border: `1px solid ${getStatusColor(status)}`,
                textTransform: 'capitalize',
                fontSize: '0.65rem',
              }}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          minHeight: 100,
        }}
      >
        {tables.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#475569', fontStyle: 'italic', alignSelf: 'center' }}>
            No tables in this area.
          </Typography>
        ) : (
          tables.map((table) => (
            <Tooltip
              key={table.id}
              title={`${table.label} · ${table.status} · ${table.seats === 0 ? 'Bar' : table.seats + ' seats'}`}
              arrow
            >
              <Box>
                <TableCard
                  table={table}
                  statusColor={getStatusColor(table.status)}
                  size="md"
                  onClick={() => onTableClick(table)}
                />
              </Box>
            </Tooltip>
          ))
        )}
      </Box>
    </Paper>
  );
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [layout, setLayout] = useState<SavedRestaurantLayout | null>(null);
  const [selectedTable, setSelectedTable] = useState<LayoutTable | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('restaurantLayout');
    if (raw) {
      try {
        setLayout(JSON.parse(raw));
      } catch {
        // corrupt data
      }
    }
  }, []);

  if (!layout) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            background: '#1e293b',
            border: '1px solid #334155',
            maxWidth: 420,
          }}
        >
          <Typography sx={{ fontSize: 48, mb: 2 }}>🍽️</Typography>
          <Typography variant="h5" sx={{ color: '#f1f5f9', mb: 1 }}>
            No Layout Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            Set up your restaurant layout first to see the live dashboard.
          </Typography>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => navigate('/setup')}
            sx={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              '&:hover': { background: 'linear-gradient(135deg, #fb923c, #f97316)' },
            }}
          >
            Setup Restaurant
          </Button>
        </Paper>
      </Box>
    );
  }

  const { areas, seatingConfig, layout: tables, savedAt } = layout;
  const getStatusColor = (status: string) =>
    seatingConfig.statusColors[status as keyof typeof seatingConfig.statusColors] || '#4caf50';

  const totalByStatus = tables.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0f172a',
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          borderBottom: '1px solid #334155',
          background: 'rgba(30,41,59,0.95)',
          backdropFilter: 'blur(8px)',
          px: { xs: 2, md: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'sticky',
          top: 0,
          zIndex: 100,
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
        <Box>
          <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, lineHeight: 1 }}>
            Restaurant Dashboard
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Layout saved {new Date(savedAt).toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Status summary pills */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(totalByStatus).map(([status, count]) => (
            <Chip
              key={status}
              label={`${count} ${status}`}
              size="small"
              sx={{
                background: `${getStatusColor(status)}18`,
                color: getStatusColor(status),
                border: `1px solid ${getStatusColor(status)}`,
                textTransform: 'capitalize',
              }}
            />
          ))}
        </Box>

        <Tooltip title="Reconfigure layout">
          <IconButton
            onClick={() => navigate('/setup')}
            sx={{ color: '#64748b', '&:hover': { color: '#f97316' } }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats bar */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 2,
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          borderBottom: '1px solid #1e293b',
        }}
      >
        {[
          { label: 'Total Areas', value: areas.length, color: '#6366f1' },
          { label: 'Total Tables', value: tables.length, color: '#f97316' },
          { label: 'Available', value: totalByStatus.available || 0, color: '#4caf50' },
          { label: 'Occupied', value: totalByStatus.occupied || 0, color: '#f44336' },
          { label: 'Reserved', value: totalByStatus.reserved || 0, color: '#ff9800' },
          { label: 'Cleaning', value: totalByStatus.cleaning || 0, color: '#9c27b0' },
        ].map(({ label, value, color }) => (
          <Paper
            key={label}
            elevation={0}
            sx={{
              px: 3,
              py: 1.5,
              background: `${color}0d`,
              border: `1px solid ${color}33`,
              borderRadius: 2,
              textAlign: 'center',
              minWidth: 100,
              flexShrink: 0,
            }}
          >
            <Typography variant="h5" sx={{ color, fontWeight: 700, lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Area sections */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        {areas.map((area) => (
          <AreaSection
            key={area.type}
            areaName={area.type}
            tables={tables.filter((t) => t.area === area.type)}
            statusColors={seatingConfig.statusColors as unknown as Record<string, string>}
            onTableClick={setSelectedTable}
          />
        ))}
      </Box>

      {/* Legend */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: 'rgba(30,41,59,0.4)',
            border: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
            LEGEND:
          </Typography>
          {Object.entries(seatingConfig.statusColors).map(([status, color]) => (
            <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
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
          <Box sx={{ ml: 'auto' }}>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              Click any table for details
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Detail modal */}
      <TableDetailModal
        table={selectedTable}
        statusColor={selectedTable ? getStatusColor(selectedTable.status) : '#4caf50'}
        onClose={() => setSelectedTable(null)}
      />
    </Box>
  );
};

export default DashboardPage;
