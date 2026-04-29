/**
 * LayoutCanvas – Step 3 of the Restaurant Layout Wizard
 *
 * Features
 *  • Area tabs (one canvas per area)
 *  • Drag from palette  → drop onto canvas to add a table
 *  • Drag placed table  → reposition it on the canvas
 *  • Click table        → select it and show a floating toolbar
 *  • Toolbar: RotateLeft | RotateRight | ─ | Shrink | Scale% | Expand | ─ | Delete
 *  • All table fields (rotation, scale) default safely with ?? so old
 *    tables without those fields never crash
 */

import { useCallback, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { v4 as uuid } from 'uuid';

import { useLayoutStore } from '../store/useLayoutStore';
import type { TableItem, TableShape } from '../store/useLayoutStore';
import TableSVG from './TableItem';

// ─── Constants ────────────────────────────────────────────────────────────────
const CANVAS_H = 460;
const SCALE_MIN = 0.5;
const SCALE_MAX = 2.0;
const SCALE_STEP = 0.25;

/** Safe-read helpers — guards against tables that pre-date these fields */
const safeRotation = (t: TableItem) => t.rotation ?? 0;
const safeScale = (t: TableItem) => t.scale ?? 1;

/** Converts a dnd-kit transform object → CSS transform string */
const toCSSTransform = (tr: { x: number; y: number } | null) =>
  tr ? `translate3d(${tr.x}px, ${tr.y}px, 0)` : undefined;

// ─── Palette definitions ──────────────────────────────────────────────────────
interface PaletteDef {
  id: string;
  label: string;
  seats: number;
  shape: TableShape;
}

const PALETTE: PaletteDef[] = [
  { id: 'pal-2', label: '2-Seat', seats: 2, shape: 'Rectangle' },
  { id: 'pal-4', label: '4-Seat', seats: 4, shape: 'Rectangle' },
  { id: 'pal-6', label: '6-Seat', seats: 6, shape: 'Rectangle' },
  { id: 'pal-8', label: '8-Seat', seats: 8, shape: 'Rectangle' },
  { id: 'pal-booth', label: 'Booth', seats: 4, shape: 'Curved' },
  { id: 'pal-round', label: 'Round', seats: 4, shape: 'Round' },
  { id: 'pal-label', label: 'Label', seats: 0, shape: 'Label' },
];

// ─── Divider helper ───────────────────────────────────────────────────────────
const ToolbarDivider = () => (
  <Box
    sx={{
      width: '1px',
      height: 16,
      background: '#334155',
      mx: 0.5,
      flexShrink: 0,
    }}
  />
);

// ─── Draggable palette item ───────────────────────────────────────────────────
const PaletteItem = ({ item, area }: { item: PaletteDef; area: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `pal::${item.id}`,
      data: { kind: 'palette', seats: item.seats, shape: item.shape, area },
    });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 1,
        borderRadius: 1.5,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.3 : 1,
        userSelect: 'none',
        touchAction: 'none',
        flexShrink: 0,
        transform: toCSSTransform(transform),
        transition: 'background 0.15s',
        '&:hover': { background: 'rgba(249,115,22,0.13)' },
      }}
    >
      <TableSVG seats={item.seats} shape={item.shape} scale={0.82} />
      <Typography
        sx={{ fontSize: '0.58rem', color: '#94a3b8', lineHeight: 1, mt: 0.25 }}
      >
        {item.label}
      </Typography>
    </Box>
  );
};

// ─── Floating selection toolbar ───────────────────────────────────────────────
interface ToolbarProps {
  table: TableItem;
  onRotate: (id: string, delta: number) => void;
  onScale: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const SelectionToolbar = ({
  table,
  onRotate,
  onScale,
  onRemove,
}: ToolbarProps) => {
  const sc = safeScale(table);

  return (
    <Box
      /* stop any mousedown from bubbling to the drag listener */
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      sx={{
        position: 'absolute',
        top: -44,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 1.5,
        px: 0.75,
        py: 0.5,
        zIndex: 50,
        whiteSpace: 'nowrap',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
        gap: 0.25,
      }}
    >
      {/* Rotate left */}
      <Tooltip title='Rotate left 90°' placement='top' arrow>
        <IconButton
          size='small'
          onClick={() => onRotate(table.id, -90)}
          sx={{
            color: '#94a3b8',
            width: 26,
            height: 26,
            '&:hover': { color: '#f97316' },
          }}
        >
          <RotateLeftIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>

      {/* Rotate right */}
      <Tooltip title='Rotate right 90°' placement='top' arrow>
        <IconButton
          size='small'
          onClick={() => onRotate(table.id, 90)}
          sx={{
            color: '#94a3b8',
            width: 26,
            height: 26,
            '&:hover': { color: '#f97316' },
          }}
        >
          <RotateRightIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>

      <ToolbarDivider />

      {/* Shrink */}
      <Tooltip title={`Shrink (min ${SCALE_MIN}×)`} placement='top' arrow>
        <span>
          <IconButton
            size='small'
            disabled={sc <= SCALE_MIN}
            onClick={() => onScale(table.id, -SCALE_STEP)}
            sx={{
              width: 26,
              height: 26,
              color: sc <= SCALE_MIN ? '#1e293b' : '#94a3b8',
              '&:hover': { color: '#f97316' },
              '&.Mui-disabled': { color: '#1e293b' },
            }}
          >
            <RemoveIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </span>
      </Tooltip>

      {/* Scale readout */}
      <Typography
        sx={{
          fontSize: '0.58rem',
          color: '#64748b',
          minWidth: 32,
          textAlign: 'center',
          lineHeight: '26px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {sc.toFixed(2)}×
      </Typography>

      {/* Expand */}
      <Tooltip title={`Expand (max ${SCALE_MAX}×)`} placement='top' arrow>
        <span>
          <IconButton
            size='small'
            disabled={sc >= SCALE_MAX}
            onClick={() => onScale(table.id, SCALE_STEP)}
            sx={{
              width: 26,
              height: 26,
              color: sc >= SCALE_MAX ? '#1e293b' : '#94a3b8',
              '&:hover': { color: '#f97316' },
              '&.Mui-disabled': { color: '#1e293b' },
            }}
          >
            <AddIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </span>
      </Tooltip>

      <ToolbarDivider />

      {/* Delete */}
      <Tooltip title='Delete table' placement='top' arrow>
        <IconButton
          size='small'
          onClick={() => onRemove(table.id)}
          sx={{
            width: 26,
            height: 26,
            color: '#ef4444',
            '&:hover': { background: 'rgba(239,68,68,0.18)', color: '#ef4444' },
          }}
        >
          <DeleteIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// ─── Single placed table on the canvas ───────────────────────────────────────
interface PlacedTableProps {
  table: TableItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRotate: (id: string, delta: number) => void;
  onScale: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const PlacedTable = ({
  table,
  isSelected,
  onSelect,
  onRotate,
  onScale,
  onRemove,
}: PlacedTableProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed::${table.id}`,
      data: { kind: 'placed', tableId: table.id, area: table.area },
    });

  return (
    <Box
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: table.x,
        top: table.y,
        transform: toCSSTransform(transform),
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 200 : isSelected ? 10 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(table.id);
      }}
    >
      {/* Floating toolbar — only when selected */}
      {isSelected && (
        <SelectionToolbar
          table={table}
          onRotate={onRotate}
          onScale={onScale}
          onRemove={onRemove}
        />
      )}

      {/* Table SVG — drag handle + rotation + selection ring */}
      <Box
        {...listeners}
        {...attributes}
        sx={{
          display: 'inline-block',
          transform: `rotate(${safeRotation(table)}deg)`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s',
          outline: isSelected ? '2px solid #f97316' : '2px solid transparent',
          outlineOffset: 4,
          borderRadius: 1,
          cursor: isDragging ? 'grabbing' : 'grab',
          '&:hover': !isSelected
            ? { outline: '2px solid rgba(249,115,22,0.4)', outlineOffset: 4 }
            : {},
        }}
      >
        <TableSVG
          seats={table.seats}
          shape={table.shape}
          scale={safeScale(table)}
        />
      </Box>
    </Box>
  );
};

// ─── Droppable canvas ─────────────────────────────────────────────────────────
interface DropCanvasProps {
  areaId: string;
  tables: TableItem[];
  isOver: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onRotate: (id: string, delta: number) => void;
  onScale: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const DropCanvas = ({
  areaId,
  tables,
  isOver,
  selectedId,
  onSelect,
  onRotate,
  onScale,
  onRemove,
}: DropCanvasProps) => {
  const { setNodeRef } = useDroppable({
    id: `canvas::${areaId}`,
    data: { area: areaId },
  });

  return (
    <Box
      ref={setNodeRef}
      id={`canvas::${areaId}`}
      onClick={() => onSelect(null)}
      sx={{
        position: 'relative',
        width: '100%',
        height: CANVAS_H,
        background: isOver ? '#eef2f7' : '#e4eaf0',
        border: `2px dashed ${isOver ? '#f97316' : '#bbc5d0'}`,
        borderRadius: 1.5,
        overflow: 'hidden',
        transition: 'background 0.2s, border-color 0.2s',
        backgroundImage: isOver
          ? 'none'
          : 'radial-gradient(circle, #b8c4cf 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      }}
    >
      {/* Empty state hint */}
      {tables.length === 0 && !isOver && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography sx={{ color: '#a8b5c0', fontSize: '0.85rem' }}>
            Drag tables here
          </Typography>
        </Box>
      )}

      {/* Placed tables */}
      {tables.map((t) => (
        <PlacedTable
          key={t.id}
          table={t}
          isSelected={selectedId === t.id}
          onSelect={onSelect}
          onRotate={onRotate}
          onScale={onScale}
          onRemove={onRemove}
        />
      ))}
    </Box>
  );
};

// ─── Main LayoutCanvas ────────────────────────────────────────────────────────
const LayoutCanvas = () => {
  const { areas, layout, addTable, updateTable, removeTable, setStep } =
    useLayoutStore();

  const [activeTab, setActiveTab] = useState(0);
  const [overCanvas, setOverCanvas] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{
    seats: number;
    shape: TableShape;
  } | null>(null);

  const counterRef = useRef(0);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 6 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 8 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  // Derive current area safely
  const currentArea = areas[activeTab]?.type ?? areas[0]?.type ?? '';
  const currentTables = layout[currentArea] ?? [];
  const areaDetail = areas[activeTab] ?? null;

  // ── Drag: start ─────────────────────────────────────────────────────────────
  const handleDragStart = (e: DragStartEvent) => {
    setSelectedId(null);
    const d = e.active.data.current;
    if (!d) return;

    if (d.kind === 'palette') {
      setGhost({ seats: d.seats as number, shape: d.shape as TableShape });
    } else if (d.kind === 'placed') {
      const src = (layout[d.area as string] ?? []).find(
        (t) => t.id === d.tableId,
      );
      if (src) setGhost({ seats: src.seats, shape: src.shape });
    }
  };

  // ── Drag: over ──────────────────────────────────────────────────────────────
  const handleDragOver = (e: DragOverEvent) => {
    const id = e.over ? String(e.over.id) : null;
    setOverCanvas(id?.startsWith('canvas::') ? id : null);
  };

  // ── Drag: end ───────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      setGhost(null);
      setOverCanvas(null);

      const { active, over, delta } = e;
      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;
      if (!activeData) return;

      const overId = String(over.id);
      if (!overId.startsWith('canvas::')) return;

      const targetArea = overData?.area as string | undefined;
      if (!targetArea) return;

      const canvasEl = document.getElementById(`canvas::${targetArea}`);
      if (!canvasEl) return;

      const rect = canvasEl.getBoundingClientRect();
      const initialRect = active.rect.current.initial;
      if (!initialRect) return;

      if (activeData.kind === 'palette') {
        // ── Drop new table from palette ──────────────────────────────────────
        counterRef.current += 1;
        const idx = counterRef.current;
        const rawX = Math.round(initialRect.left - rect.left + delta.x);
        const rawY = Math.round(initialRect.top - rect.top + delta.y);

        const newTable: TableItem = {
          id: `T-${uuid()}`,
          label:
            activeData.shape === 'Label'
              ? 'Label'
              : `T${String(idx).padStart(2, '0')}`,
          x: Math.max(5, Math.min(rawX, rect.width - 20)),
          y: Math.max(5, Math.min(rawY, CANVAS_H - 20)),
          seats: activeData.seats as number,
          shape: activeData.shape as TableShape,
          status: 'available',
          area: targetArea as TableItem['area'],
          rotation: 0, // always initialise — prevents undefined crash
          scale: 1, // always initialise — prevents undefined crash
        };
        addTable(targetArea, newTable);
      } else if (activeData.kind === 'placed') {
        // ── Move existing placed table ────────────────────────────────────────
        const src = (layout[activeData.area as string] ?? []).find(
          (t) => t.id === activeData.tableId,
        );
        if (!src) return;

        updateTable(activeData.area as string, {
          ...src,
          x: Math.max(
            5,
            Math.min(Math.round(src.x + delta.x), rect.width - 20),
          ),
          y: Math.max(5, Math.min(Math.round(src.y + delta.y), CANVAS_H - 20)),
          area: targetArea as TableItem['area'],
        });
      }
    },
    [layout, addTable, updateTable],
  );

  // ── Rotate ───────────────────────────────────────────────────────────────────
  const handleRotate = useCallback(
    (id: string, delta: number) => {
      const tbl = currentTables.find((t) => t.id === id);
      if (!tbl) return;
      updateTable(currentArea, {
        ...tbl,
        rotation: (safeRotation(tbl) + delta + 360) % 360,
      });
    },
    [currentTables, currentArea, updateTable],
  );

  // ── Scale ────────────────────────────────────────────────────────────────────
  const handleScale = useCallback(
    (id: string, delta: number) => {
      const tbl = currentTables.find((t) => t.id === id);
      if (!tbl) return;
      const next = Math.round((safeScale(tbl) + delta) * 100) / 100;
      updateTable(currentArea, {
        ...tbl,
        scale: Math.min(SCALE_MAX, Math.max(SCALE_MIN, next)),
      });
    },
    [currentTables, currentArea, updateTable],
  );

  // ── Remove ───────────────────────────────────────────────────────────────────
  const handleRemove = useCallback(
    (id: string) => {
      removeTable(currentArea, id);
      setSelectedId((prev) => (prev === id ? null : prev));
    },
    [currentArea, removeTable],
  );

  // ── Tab change ────────────────────────────────────────────────────────────────
  const handleTabChange = (_: React.SyntheticEvent, v: number) => {
    setActiveTab(v);
    setSelectedId(null);
  };

  // ── Validation ────────────────────────────────────────────────────────────────
  const isValid = areas.every((a) => (layout[a.type] ?? []).length > 0);

  const handleNext = () => {
    if (!isValid) {
      alert('Place at least one table in every area before continuing.');
      return;
    }
    setStep(3);
  };

  // ── No areas guard ────────────────────────────────────────────────────────────
  if (areas.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography sx={{ color: '#94a3b8', mb: 2 }}>
          No areas configured. Go back and add at least one area.
        </Typography>
        <Button variant='outlined' color='error' onClick={() => setStep(0)}>
          ← Back to Area Setup
        </Button>
      </Box>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Area tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
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
        {areas.map((a) => (
          <Tab key={a.type} label={a.type} />
        ))}
      </Tabs>

      {/* Area meta */}
      <Typography
        variant='caption'
        sx={{ color: '#64748b', mb: 1, display: 'block' }}
      >
        {currentArea} Restaurant Area
        {selectedId && (
          <Box component='span' sx={{ ml: 2, color: '#f97316' }}>
            · Click toolbar above table to rotate, resize or delete
          </Box>
        )}
      </Typography>

      {/* Canvas row with rotated Length label */}
      <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1, mb: 0.5 }}>
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

        <Box sx={{ flex: 1 }}>
          <DropCanvas
            areaId={currentArea}
            tables={currentTables}
            isOver={overCanvas === `canvas::${currentArea}`}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRotate={handleRotate}
            onScale={handleScale}
            onRemove={handleRemove}
          />
        </Box>
      </Box>

      {/* Width label */}
      <Box sx={{ pl: 3.5, mb: 1 }}>
        <Typography
          sx={{
            color: '#64748b',
            fontSize: '0.62rem',
            textAlign: 'center',
            letterSpacing: 0.3,
          }}
        >
          {areaDetail ? `Width ${areaDetail.width}m` : 'Width'}
        </Typography>
      </Box>

      {/* Palette */}
      <Box sx={{ pl: 3.5 }}>
        <Typography sx={{ color: '#ef4444', fontSize: '0.68rem', mb: 1 }}>
          Drag and drop tables on above area
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.75,
            background: 'rgba(15,23,42,0.55)',
            border: '1px solid #1e293b',
            borderRadius: 2,
            overflowX: 'auto',
          }}
        >
          {PALETTE.map((item) => (
            <PaletteItem key={item.id} item={item} area={currentArea} />
          ))}
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant='outlined'
          onClick={() => setStep(1)}
          sx={{
            borderColor: '#334155',
            color: '#94a3b8',
            '&:hover': {
              borderColor: '#64748b',
              background: 'rgba(100,116,139,0.08)',
            },
          }}
        >
          ← Back
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={handleNext}
          sx={{ px: 4 }}
        >
          Next: Preview →
        </Button>
      </Box>

      {/* Drag ghost overlay */}
      <DragOverlay dropAnimation={null}>
        {ghost && (
          <Box sx={{ opacity: 0.8, pointerEvents: 'none' }}>
            <TableSVG seats={ghost.seats} shape={ghost.shape} scale={1} ghost />
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default LayoutCanvas;
