import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Divider,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ChairIcon           from '@mui/icons-material/Chair';
import CheckCircleIcon     from '@mui/icons-material/CheckCircle';
import EditIcon            from '@mui/icons-material/Edit';
import { useLayoutStore }  from '../store/useLayoutStore';
import TableSVG from './TableItem';

const CANVAS_H = 460;

// ── Shape label helper ────────────────────────────────────────────────────────
const shapeLabel: Record<string, string> = {
  Rectangle: 'Rectangular',
  Round:     'Round',
  Curved:    'Booth',
  Label:     'Label',
};

// ── Status colour ─────────────────────────────────────────────────────────────
const statusColour: Record<string, string> = {
  available: '#4ade80',
  occupied:  '#f87171',
  reserved:  '#fb923c',
  cleaning:  '#c084fc',
};

// ─── Preview read-only canvas ─────────────────────────────────────────────────
const PreviewCanvas = ({ areaType }: { areaType: string }) => {
  const { areas, layout } = useLayoutStore();
  const tables = layout[areaType] || [];
  const areaDetail = areas.find((a) => a.type === areaType);

  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1, mb: 0.5 }}>
      {/* Length label */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            color: '#64748b',
            fontSize: '0.62rem',
            whiteSpace: 'nowrap',
            transform: 'rotate(-90deg)',
            letterSpacing: 0.3,
          }}
        >
          {areaDetail ? `Length ${areaDetail.length}m` : 'Length'}
        </Typography>
      </Box>

      {/* Canvas */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          height: CANVAS_H,
          background: '#e4eaf0',
          border: '2px solid #bbc5d0',
          borderRadius: 1.5,
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(circle, #b8c4cf 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      >
        {tables.length === 0 && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#a8b5c0', fontSize: '0.85rem' }}>
              No tables placed in this area
            </Typography>
          </Box>
        )}

        {tables.map((t) => (
          <Tooltip
            key={t.id}
            placement="top"
            arrow
            title={
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                  {t.label}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  {t.shape === 'Label' ? 'Text label' : `${t.seats} seats · ${shapeLabel[t.shape]}`}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: statusColour[t.status] ?? '#4ade80', textTransform: 'capitalize' }}
                >
                  ● {t.status}
                </Typography>
              </Box>
            }
          >
            <Box
              sx={{
                position: 'absolute',
                left: t.x,
                top: t.y,
                display: 'inline-block',
                transform: `rotate(${t.rotation ?? 0}deg)`,
                transformOrigin: 'center center',
                cursor: 'default',
              }}
            >
              <TableSVG seats={t.seats} shape={t.shape} scale={t.scale ?? 1} />
              {/* Table label overlay */}
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.5rem',
                  color: '#475569',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  background: 'rgba(228,234,240,0.85)',
                  px: 0.5,
                  borderRadius: 0.5,
                }}
              >
                {t.label}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

// ─── Main Preview ─────────────────────────────────────────────────────────────
const Preview = () => {
  const { areas, layout, setStep, markComplete } = useLayoutStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab]  = useState(0);

  const currentArea = areas[activeTab]?.type ?? '';

  // ── Global stats ─────────────────────────────────────────────────────────────
  const allTables    = Object.values(layout).flat();
  const totalTables  = allTables.length;
  const totalSeats   = allTables.reduce((s, t) => s + t.seats, 0);

  // ── Per-area stats ───────────────────────────────────────────────────────────
  const currentTables    = layout[currentArea] || [];
  const currentSeats     = currentTables.reduce((s, t) => s + t.seats, 0);
  const currentAreaDetail = areas[activeTab];

  if (areas.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography sx={{ color: '#94a3b8', mb: 2 }}>
          No layout configured yet. Start from Area Setup.
        </Typography>
        <Button variant="outlined" color="error" onClick={() => setStep(0)}>
          ← Start Over
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Global summary row ──────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        {[
          { icon: <TableRestaurantIcon sx={{ fontSize: 20 }} />, label: 'Total Tables',   value: totalTables },
          { icon: <ChairIcon           sx={{ fontSize: 20 }} />, label: 'Total Seats',    value: totalSeats  },
          { icon: <CheckCircleIcon     sx={{ fontSize: 20 }} />, label: 'Areas Covered',  value: areas.length },
        ].map(({ icon, label, value }) => (
          <Box
            key={label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1.5,
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 2,
              minWidth: 140,
            }}
          >
            <Box sx={{ color: '#f97316' }}>{icon}</Box>
            <Box>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>
                {value}
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#64748b' }}>{label}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: '#1e293b', mb: 2.5 }} />

      {/* ── Area tabs ─────────────────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onChange={(_, v: number) => setActiveTab(v)}
        sx={{
          mb: 1.5,
          borderBottom: '1px solid #3a3f47',
          '& .MuiTab-root': {
            color: '#64748b',
            fontWeight: 600,
            textTransform: 'none',
            minHeight: 42,
            px: 3,
          },
          '& .Mui-selected': { color: '#f97316 !important' },
          '& .MuiTabs-indicator': { backgroundColor: '#f97316', height: 3 },
        }}
      >
        {areas.map((a) => {
          const count = (layout[a.type] || []).length;
          return (
            <Tab
              key={a.type}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {a.type}
                  <Chip
                    label={count}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      background: count > 0 ? 'rgba(249,115,22,0.2)' : 'rgba(100,116,139,0.2)',
                      color:      count > 0 ? '#f97316'              : '#64748b',
                    }}
                  />
                </Box>
              }
            />
          );
        })}
      </Tabs>

      {/* ── Per-area metadata row ──────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          {currentArea} Restaurant Area
        </Typography>
        {currentAreaDetail && (
          <>
            <Chip
              label={`${currentAreaDetail.length}m × ${currentAreaDetail.width}m`}
              size="small"
              sx={{ height: 20, background: '#1e293b', color: '#94a3b8', fontSize: '0.6rem' }}
            />
          </>
        )}
        <Chip
          label={`${currentTables.length} table${currentTables.length !== 1 ? 's' : ''}`}
          size="small"
          sx={{
            height: 20,
            background: currentTables.length > 0 ? 'rgba(74,222,128,0.15)' : 'rgba(100,116,139,0.15)',
            color:      currentTables.length > 0 ? '#4ade80'               : '#64748b',
            fontSize: '0.6rem',
          }}
        />
        <Chip
          label={`${currentSeats} seat${currentSeats !== 1 ? 's' : ''}`}
          size="small"
          sx={{ height: 20, background: 'rgba(96,165,250,0.15)', color: '#60a5fa', fontSize: '0.6rem' }}
        />
      </Box>

      {/* ── Read-only canvas ──────────────────────────────────────────────── */}
      <PreviewCanvas areaType={currentArea} />

      {/* Width label */}
      <Box sx={{ pl: 3.5, mb: 3 }}>
        <Typography
          sx={{ color: '#64748b', fontSize: '0.62rem', textAlign: 'center', letterSpacing: 0.3 }}
        >
          {currentAreaDetail ? `Width ${currentAreaDetail.width}m` : 'Width'}
        </Typography>
      </Box>

      {/* ── Table legend for current area ─────────────────────────────────── */}
      {currentTables.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 3,
            pl: 3.5,
          }}
        >
          {currentTables.map((t) => (
            <Chip
              key={t.id}
              label={`${t.label}${t.shape !== 'Label' ? ` · ${t.seats}s` : ''}`}
              size="small"
              sx={{
                height: 22,
                background: 'rgba(30,41,59,0.7)',
                color: '#94a3b8',
                fontSize: '0.6rem',
                border: '1px solid #334155',
              }}
            />
          ))}
        </Box>
      )}

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => setStep(2)}
          sx={{
            borderColor: '#334155',
            color: '#94a3b8',
            '&:hover': { borderColor: '#64748b', background: 'rgba(100,116,139,0.08)' },
          }}
        >
          Edit Layout
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<CheckCircleIcon />}
          onClick={() => { markComplete(); navigate('/dashboard'); }}
          sx={{
            px: 4,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            '&:hover': { background: 'linear-gradient(135deg, #fb923c, #f97316)' },
          }}
        >
          Complete Setup
        </Button>
      </Box>
    </Box>
  );
};

export default Preview;
