/**
 * SeatingForm – Step 2
 *
 * Each area (Indoor / Outdoor / Bar) gets its OWN tab where the user sets
 * how many tables of each type belong in that section.
 * On "Next" every area's canvas is pre-populated independently.
 */

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon    from '@mui/icons-material/ArrowForward';
import ChairIcon           from '@mui/icons-material/Chair';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import { v4 as uuid }     from 'uuid';

import { useLayoutStore }                   from '../store/useLayoutStore';
import type { AreaType, TableItem, TableShape } from '../store/useLayoutStore';
import TableSVG                             from './TableItem';

// ─── Table type definitions ───────────────────────────────────────────────────
const TABLE_TYPES = [
  { key: 'two',   seats: 2, shape: 'Rectangle' as TableShape, label: '2-Seat', color: '#60a5fa' },
  { key: 'four',  seats: 4, shape: 'Rectangle' as TableShape, label: '4-Seat', color: '#4ade80' },
  { key: 'six',   seats: 6, shape: 'Rectangle' as TableShape, label: '6-Seat', color: '#f97316' },
  { key: 'eight', seats: 8, shape: 'Rectangle' as TableShape, label: '8-Seat', color: '#a78bfa' },
  { key: 'booth', seats: 4, shape: 'Curved'    as TableShape, label: 'Booth',  color: '#fb923c' },
  { key: 'round', seats: 4, shape: 'Round'     as TableShape, label: 'Round',  color: '#34d399' },
] as const;

type TypeKey  = typeof TABLE_TYPES[number]['key'];
type AreaCounts = Record<TypeKey, number>;

const EMPTY_COUNTS: AreaCounts = { two: 0, four: 0, six: 0, eight: 0, booth: 0, round: 0 };

// ─── Grid-place helper ────────────────────────────────────────────────────────
const gridPlace = (
  slots: { seats: number; shape: TableShape }[],
  area:  AreaType,
): TableItem[] => {
  const n = slots.length;
  if (n === 0) return [];

  const CW = 800, CH = 460, MARGIN = 40;
  const usableW = CW - MARGIN * 2;
  const usableH = CH - MARGIN * 2;
  const aspect  = usableW / usableH;
  const cols    = Math.min(n, Math.max(1, Math.round(Math.sqrt(n * aspect))));
  const rows    = Math.ceil(n / cols);
  const slotW   = Math.floor(usableW / cols);
  const slotH   = Math.floor(usableH / rows);

  const baseX = Math.floor((CW - cols * slotW) / 2);
  const baseY = Math.floor((CH - rows * slotH) / 2);

  const lastRowCount = n - (rows - 1) * cols;
  const lastRowShift = lastRowCount < cols
    ? Math.floor(((cols - lastRowCount) * slotW) / 2)
    : 0;

  return slots.map((s, i) => {
    const row       = Math.floor(i / cols);
    const col       = i % cols;
    const isLastRow = row === rows - 1;
    return {
      id:       `T-${uuid()}`,
      label:    `T${String(i + 1).padStart(2, '0')}`,
      x:        baseX + col * slotW + (isLastRow ? lastRowShift : 0) + Math.floor(slotW * 0.08),
      y:        baseY + row * slotH + Math.floor(slotH * 0.08),
      seats:    s.seats,
      shape:    s.shape,
      status:   'available',
      area,
      rotation: 0,
      scale:    1,
    };
  });
};

// ─── Single type mini-card ────────────────────────────────────────────────────
const TypeCard = ({
  seats, shape, label, color, value, onChange,
}: {
  seats: number; shape: TableShape; label: string;
  color: string; value: number; onChange: (v: number) => void;
}) => (
  <Box
    sx={{
      flex:          '1 1 130px',
      background:    `${color}0d`,
      border:        `1px solid ${color}35`,
      borderRadius:  2,
      p:             1.5,
      display:       'flex',
      flexDirection: 'column',
      gap:           1,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ flexShrink: 0, opacity: 0.85 }}>
        <TableSVG seats={seats} shape={shape} scale={0.5} />
      </Box>
      <Box>
        <Typography sx={{ color, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.58rem', mt: 0.25 }}>
          {value * seats} seats
        </Typography>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1, minWidth: 24 }}>
        {value}
      </Typography>
      <TextField
        type="number"
        size="small"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        inputProps={{ min: 0 }}
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            color: '#f1f5f9', fontSize: '0.8rem', height: 30,
            '& fieldset':             { borderColor: `${color}40` },
            '&:hover fieldset':       { borderColor: color },
            '&.Mui-focused fieldset': { borderColor: color },
          },
          '& input': { py: '4px', px: 1 },
        }}
      />
    </Box>
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────
const SeatingForm = () => {
  const { areas, setSeating, setLayout, setStep } = useLayoutStore();

  // Per-area counts keyed by area type
  const [activeTab, setActiveTab] = useState(0);
  const [perArea, setPerArea] = useState<Record<string, AreaCounts>>(() => {
    const init: Record<string, AreaCounts> = {};
    areas.forEach((a) => { init[a.type] = { ...EMPTY_COUNTS }; });
    return init;
  });
  const [error, setError] = useState('');

  const currentAreaType = areas[activeTab]?.type ?? '';
  const currentCounts   = perArea[currentAreaType] ?? EMPTY_COUNTS;

  const setCount = (key: TypeKey) => (v: number) => {
    setPerArea((prev) => ({
      ...prev,
      [currentAreaType]: { ...prev[currentAreaType], [key]: v },
    }));
    setError('');
  };

  // Grand totals across all areas
  const grandTotalTables = areas.reduce((sum, a) => {
    const c = perArea[a.type] ?? EMPTY_COUNTS;
    return sum + TABLE_TYPES.reduce((s, t) => s + c[t.key], 0);
  }, 0);
  const grandTotalSeats = areas.reduce((sum, a) => {
    const c = perArea[a.type] ?? EMPTY_COUNTS;
    return sum + TABLE_TYPES.reduce((s, t) => s + c[t.key] * t.seats, 0);
  }, 0);

  // Per-current-area totals
  const areaTotalTables = TABLE_TYPES.reduce((s, t) => s + currentCounts[t.key], 0);
  const areaTotalSeats  = TABLE_TYPES.reduce((s, t) => s + currentCounts[t.key] * t.seats, 0);

  // ── Next ──────────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (grandTotalTables === 0) {
      setError('Add at least one table in any section before continuing.');
      return;
    }
    setError('');

    // Build layout independently per area (no round-robin)
    const layout: Record<string, TableItem[]> = {};
    areas.forEach((a) => {
      const c    = perArea[a.type] ?? EMPTY_COUNTS;
      const flat = TABLE_TYPES.flatMap((t) =>
        Array.from({ length: c[t.key] }, () => ({ seats: t.seats, shape: t.shape })),
      );
      layout[a.type] = gridPlace(flat, a.type);
    });

    setSeating({ grandTotalTables, grandTotalSeats, perArea });
    setLayout(layout);
    setStep(2);
  };

  if (areas.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography sx={{ color: '#94a3b8', mb: 2 }}>No areas configured. Go back and add areas first.</Typography>
        <Button variant="outlined" color="error" onClick={() => setStep(0)}>← Back to Area Setup</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ color: '#94a3b8', mb: 2.5, fontSize: '0.85rem', lineHeight: 1.6 }}>
        Configure tables <strong style={{ color: '#f1f5f9' }}>separately for each section</strong>. Switch between area
        tabs and set how many tables of each type belong there. Clicking{' '}
        <Box component="span" sx={{ color: '#f97316', fontWeight: 600 }}>Next: Layout Builder</Box>{' '}
        auto-places them on each section's canvas.
      </Typography>

      {/* ── Area tabs ────────────────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{
          mb: 2,
          borderBottom: '1px solid #1e293b',
          '& .MuiTab-root':        { color: '#64748b', fontWeight: 600, textTransform: 'none', minHeight: 40 },
          '& .Mui-selected':       { color: '#f97316 !important' },
          '& .MuiTabs-indicator':  { backgroundColor: '#f97316', height: 3 },
        }}
      >
        {areas.map((a) => {
          const c     = perArea[a.type] ?? EMPTY_COUNTS;
          const count = TABLE_TYPES.reduce((s, t) => s + c[t.key], 0);
          return (
            <Tab
              key={a.type}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {a.type}
                  <Chip
                    label={count}
                    size="small"
                    sx={{
                      height: 17, fontSize: '0.58rem', fontWeight: 700,
                      background: count > 0 ? 'rgba(249,115,22,0.2)' : 'rgba(100,116,139,0.15)',
                      color:      count > 0 ? '#f97316'              : '#64748b',
                    }}
                  />
                </Box>
              }
            />
          );
        })}
      </Tabs>

      {/* ── Current area heading ──────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Typography sx={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' }}>
          {currentAreaType} Section
        </Typography>
        {areaTotalTables > 0 && (
          <>
            <Chip label={`${areaTotalTables} tables`} size="small"
              sx={{ height: 18, fontSize: '0.58rem', background: 'rgba(249,115,22,0.15)', color: '#f97316' }} />
            <Chip label={`${areaTotalSeats} seats`} size="small"
              sx={{ height: 18, fontSize: '0.58rem', background: 'rgba(74,222,128,0.12)', color: '#4ade80' }} />
          </>
        )}
      </Box>

      {/* ── Type cards for current area ───────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
        {TABLE_TYPES.map((t) => (
          <TypeCard
            key={t.key}
            seats={t.seats}
            shape={t.shape}
            label={t.label}
            color={t.color}
            value={currentCounts[t.key]}
            onChange={setCount(t.key)}
          />
        ))}
      </Box>

      {/* ── Grand totals ──────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography sx={{ color: '#475569', fontSize: '0.72rem' }}>All sections combined:</Typography>
        <Chip
          icon={<TableRestaurantIcon sx={{ fontSize: 14 }} />}
          label={`${grandTotalTables} tables`}
          size="small"
          sx={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}
        />
        <Chip
          icon={<ChairIcon sx={{ fontSize: 14 }} />}
          label={`${grandTotalSeats} seats`}
          size="small"
          sx={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}
        />
      </Box>

      {/* ── Per-section summary ───────────────────────────────────────────── */}
      {grandTotalTables > 0 && (
        <Box sx={{ mb: 3, p: 2, background: 'rgba(15,23,42,0.55)', border: '1px solid #1e293b', borderRadius: 2 }}>
          <Typography sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5 }}>
            Section summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {areas.map((a) => {
              const c      = perArea[a.type] ?? EMPTY_COUNTS;
              const total  = TABLE_TYPES.reduce((s, t) => s + c[t.key], 0);
              const seats  = TABLE_TYPES.reduce((s, t) => s + c[t.key] * t.seats, 0);
              const active = TABLE_TYPES.filter((t) => c[t.key] > 0);
              return (
                <Box key={a.type} sx={{ px: 2, py: 1.5, borderRadius: 1.5, background: 'rgba(30,41,59,0.7)', border: '1px solid #334155', minWidth: 130 }}>
                  <Typography sx={{ color: '#f97316', fontWeight: 700, fontSize: '0.75rem' }}>{a.type}</Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', mt: 0.25 }}>
                    {total > 0 ? `${total} tables · ${seats} seats` : 'No tables yet'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
                    {active.map((t) => (
                      <Chip key={t.key} label={`${c[t.key]}×${t.label}`} size="small"
                        sx={{ height: 15, fontSize: '0.52rem', background: `${t.color}20`, color: t.color }} />
                    ))}
                    {active.length === 0 && (
                      <Typography sx={{ color: '#334155', fontSize: '0.6rem' }}>—</Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Typography sx={{ color: '#475569', fontSize: '0.62rem', mt: 1.5 }}>
            ✦ Each section gets its own canvas. Tables are centred in a grid — move, rotate or resize them freely.
          </Typography>
        </Box>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, background: 'rgba(239,68,68,0.1)', color: '#f87171', '& .MuiAlert-icon': { color: '#f87171' } }}>
          {error}
        </Alert>
      )}

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => setStep(0)}
          sx={{ borderColor: '#334155', color: '#94a3b8', '&:hover': { borderColor: '#64748b', background: 'rgba(100,116,139,0.08)' } }}
        >
          Back
        </Button>
        <Tooltip title={grandTotalTables === 0 ? 'Add at least one table in any section' : ''} placement="top" arrow>
          <span>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              disabled={grandTotalTables === 0}
              sx={{
                px: 4,
                background:       'linear-gradient(135deg, #f97316, #ea580c)',
                '&:hover':        { background: 'linear-gradient(135deg, #fb923c, #f97316)' },
                '&.Mui-disabled': { background: '#1e293b', color: '#334155' },
              }}
            >
              Next: Layout Builder
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SeatingForm;
