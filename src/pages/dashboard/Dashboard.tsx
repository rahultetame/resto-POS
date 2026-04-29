// Dashboard.tsx – shows the saved restaurant layout with live status management

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Groups2Icon          from '@mui/icons-material/Groups2';
import EventIcon            from '@mui/icons-material/Event';
import SettingsIcon         from '@mui/icons-material/Settings';
import TableRestaurantIcon  from '@mui/icons-material/TableRestaurant';
import cls from './Dashboard.module.scss';

import { useLayoutStore } from '../../layouts/restaurant-layout/store/useLayoutStore';
import type { TableItem } from '../../layouts/restaurant-layout/store/useLayoutStore';

// ─── Status types & colours ───────────────────────────────────────────────────
type LiveStatus =
  | 'Available'
  | 'Occupied'
  | 'Order Placed'
  | 'Order Served'
  | 'Ready For Billing'
  | 'Paid'
  | 'Reserved';

const STATUS_COLORS: Record<LiveStatus, string> = {
  Available:          '#1BCB63',
  Occupied:           '#F4B740',
  'Order Placed':     '#FF7A1A',
  'Order Served':     '#3D73F5',
  'Ready For Billing':'#A52CF5',
  Paid:               '#A3F01A',
  Reserved:           '#FF1D25',
};

const STATUS_CYCLE: LiveStatus[] = [
  'Available', 'Occupied', 'Order Placed', 'Order Served',
  'Ready For Billing', 'Paid', 'Reserved',
];

// Map store status (lowercase) → LiveStatus
const toDisplay = (s: string): LiveStatus => {
  const map: Record<string, LiveStatus> = {
    available:          'Available',
    occupied:           'Occupied',
    'order placed':     'Order Placed',
    'order served':     'Order Served',
    'ready for billing':'Ready For Billing',
    paid:               'Paid',
    reserved:           'Reserved',
  };
  return map[s.toLowerCase()] ?? 'Available';
};

// ─── Table card ───────────────────────────────────────────────────────────────
const TableCard = ({
  table,
  status,
  onCycle,
}: {
  table:   TableItem;
  status:  LiveStatus;
  onCycle: () => void;
}) => {
  const color    = STATUS_COLORS[status];
  const chairTop = Math.min(Math.ceil(table.seats / 2), 6);
  const chairBot = Math.min(Math.floor(table.seats / 2), 6);

  const cardW = table.seats <= 2 ? 130
              : table.seats <= 4 ? 175
              : table.seats <= 6 ? 210
              : 260;
  const cardH = 150;

  return (
    <Tooltip
      arrow
      title={
        <Box>
          <Typography fontWeight={700}>{table.label}</Typography>
          <Typography variant="body2">Status: {status}</Typography>
          <Typography variant="body2">Seats: {table.seats}</Typography>
          <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#aaa', mt: 0.5 }}>
            Click to cycle status
          </Typography>
        </Box>
      }
    >
      <Box className={cls.tableWrapper} onClick={onCycle} sx={{ cursor: 'pointer' }}>
        {/* Top chairs */}
        <Box className={cls.chairRow}>
          {Array.from({ length: chairTop }).map((_, i) => (
            <Box key={i} className={cls.chair} sx={{ backgroundColor: color }} />
          ))}
        </Box>

        {/* Table body */}
        <Box
          className={cls.tableCard}
          sx={{ width: cardW, height: cardH, borderLeft: `6px solid ${color}` }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Avatar sx={{ bgcolor: `${color}20`, color, fontWeight: 700, width: 36, height: 36, fontSize: '0.75rem' }}>
              {table.label}
            </Avatar>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Groups2Icon fontSize="small" />
              <Typography variant="body2">{table.seats}</Typography>
            </Stack>
          </Stack>

          <Box mt="auto">
            <Typography className={cls.statusText} sx={{ color }}>
              {status}
            </Typography>
            <Typography className={cls.duration}>
              {status === 'Reserved' ? 'Reserved · tap to change' : status === 'Available' ? '—' : 'Tap to cycle status'}
            </Typography>
          </Box>
        </Box>

        {/* Bottom chairs */}
        <Box className={cls.chairRow}>
          {Array.from({ length: chairBot }).map((_, i) => (
            <Box key={i} className={cls.chair} sx={{ backgroundColor: color }} />
          ))}
        </Box>
      </Box>
    </Tooltip>
  );
};

// ─── No-setup prompt ──────────────────────────────────────────────────────────
const NoSetupPrompt = () => {
  const navigate = useNavigate();
  return (
    <section className={cls.dashboard}>
      <Box
        sx={{
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          justifyContent:'center',
          minHeight:     '60vh',
          gap:           3,
          textAlign:     'center',
        }}
      >
        <TableRestaurantIcon sx={{ fontSize: 64, color: '#bbb' }} />
        <Typography variant="h5" fontWeight={700} color="text.secondary">
          No restaurant layout configured yet
        </Typography>
        <Typography color="text.secondary">
          Complete the layout setup to see your seating here.
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<SettingsIcon />}
          onClick={() => navigate('/restaurant-layout')}
          sx={{ px: 4, py: 1.25, background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
        >
          Setup Restaurant Layout
        </Button>
      </Box>
    </section>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { areas, layout, isSetupComplete } = useLayoutStore();

  if (!isSetupComplete || areas.length === 0) return <NoSetupPrompt />;

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).replace(/\//g, '-');

  // ── Local live-status state (initialised from store status) ───────────────
  const allStoreTables = Object.values(layout).flat();
  const [statuses, setStatuses] = useState<Record<string, LiveStatus>>(() => {
    const init: Record<string, LiveStatus> = {};
    allStoreTables.forEach((t) => { init[t.id] = toDisplay(t.status); });
    return init;
  });

  const cycleStatus = (id: string) => {
    setStatuses((prev) => {
      const cur  = prev[id] ?? 'Available';
      const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length];
      return { ...prev, [id]: next };
    });
  };

  // ── Filters ───────────────────────────────────────────────────────────────
  const [selectedArea,   setSelectedArea]   = useState<string>('All');
  const [statusFilter,   setStatusFilter]   = useState<'All' | 'Available' | 'Occupied' | 'Reserved'>('All');

  // Tables for the selected area section
  const sectionTables: { areaType: string; tables: TableItem[] }[] =
    selectedArea === 'All'
      ? areas.map((a) => ({ areaType: a.type, tables: layout[a.type] ?? [] }))
      : [{ areaType: selectedArea, tables: layout[selectedArea] ?? [] }];

  // Status-filtered view
  const filtered = sectionTables.map(({ areaType, tables }) => ({
    areaType,
    tables: statusFilter === 'All'
      ? tables
      : tables.filter((t) => (statuses[t.id] ?? 'Available') === statusFilter),
  }));

  // ── Capacity ─────────────────────────────────────────────────────────────
  const totalAll    = allStoreTables.length;
  const occupiedAll = allStoreTables.filter(
    (t) => (statuses[t.id] ?? 'Available') !== 'Available' &&
            (statuses[t.id] ?? 'Available') !== 'Reserved',
  ).length;
  const capacityPct = totalAll > 0 ? Math.round((occupiedAll / totalAll) * 100) : 0;

  return (
    <section className={cls.dashboard}>
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <Box className={cls.topbar}>
        <Typography variant="h4" fontWeight={700}>
          All Seats
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          {(['All', 'Available', 'Occupied', 'Reserved'] as const).map((f) => (
            <Button
              key={f}
              variant="contained"
              onClick={() => setStatusFilter(f)}
              className={statusFilter === f ? '' : cls.filterBtn}
              color={statusFilter === f ? 'error' : 'inherit'}
              sx={{ textTransform: 'none', fontSize: '0.8rem', px: 2 }}
            >
              {f === 'All' ? 'All Seats' : `${f} Seats`}
            </Button>
          ))}

          <Chip
            icon={<EventIcon />}
            label={today}
            className={cls.dateChip}
          />

          <Select
            size="small"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className={cls.select}
            renderValue={(v) => v === 'All' ? 'Sitting Area Sections' : `${v} Area`}
          >
            <MenuItem value="All">All Sections</MenuItem>
            {areas.map((a) => (
              <MenuItem key={a.type} value={a.type}>{a.type} Area</MenuItem>
            ))}
          </Select>

          <Tooltip title="Edit Layout">
            <Button
              variant="outlined"
              size="small"
              startIcon={<SettingsIcon />}
              onClick={() => navigate('/restaurant-layout')}
              sx={{ textTransform: 'none', fontSize: '0.75rem', borderColor: '#ccc', color: '#444' }}
            >
              Edit Setup
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {/* ── Area sections ─────────────────────────────────────────────────── */}
      <Box className={cls.layoutContainer}>
        {filtered.map(({ areaType, tables }) => (
          <Box key={areaType} mb={4}>
            <Typography className={cls.areaTitle}>{areaType} Area</Typography>

            {tables.length === 0 ? (
              <Box sx={{ py: 3, color: '#aaa', fontSize: '0.9rem', textAlign: 'center' }}>
                No tables match the current filter in this area.
              </Box>
            ) : (
              <Box className={cls.tableGrid}>
                {tables.map((t) => (
                  <TableCard
                    key={t.id}
                    table={t}
                    status={statuses[t.id] ?? 'Available'}
                    onCycle={() => cycleStatus(t.id)}
                  />
                ))}
              </Box>
            )}
          </Box>
        ))}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <Box className={cls.footer}>
          {/* Legend */}
          <Box>
            <Typography className={cls.legendTitle}>Seat Status Code</Typography>
            <Stack direction="row" spacing={2} mt={2} flexWrap="wrap" useFlexGap>
              {Object.entries(STATUS_COLORS).map(([key, value]) => (
                <Stack key={key} direction="row" spacing={0.75} alignItems="center">
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: value }} />
                  <Typography variant="caption">{key}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Capacity */}
          <Box width="35%">
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>Actual Capacity</Typography>
              <Typography fontWeight={700}>{capacityPct}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={capacityPct}
              sx={{ height: 10, borderRadius: 999 }}
            />
            <Typography variant="caption" sx={{ color: '#888', mt: 0.5, display: 'block' }}>
              {occupiedAll} of {totalAll} tables in use · Click any table to cycle its status
            </Typography>
          </Box>
        </Box>
      </Box>
    </section>
  );
};

export default Dashboard;
