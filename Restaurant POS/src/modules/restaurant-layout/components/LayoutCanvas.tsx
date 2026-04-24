import React, { useRef, useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { LayoutTable, AreaType, TableShape } from '../store/types';

// ─── Draggable Sidebar Item ───────────────────────────────────────────────────
interface SidebarItemData {
  seats: number;
  shape: TableShape;
  area: AreaType;
  labelPrefix: string;
}

interface SidebarItemProps extends SidebarItemData {}

const SidebarItem: React.FC<SidebarItemProps> = ({ seats, shape, area, labelPrefix }) => {
  const id = `sidebar-${area}-${seats}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type: 'sidebar', seats, shape, area, labelPrefix },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      sx={{
        p: 1.5,
        mb: 1,
        background: 'rgba(15,23,42,0.7)',
        border: '1px solid #334155',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        userSelect: 'none',
        touchAction: 'none',
        '&:hover': { borderColor: '#f97316', background: 'rgba(249,115,22,0.08)' },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: shape === 'Round' ? '50%' : shape === 'Square' ? 1 : 0.5,
          background: 'rgba(249,115,22,0.25)',
          border: '2px solid #f97316',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: '0.65rem', color: '#f97316', fontWeight: 700 }}>
          {seats === 0 ? 'B' : seats}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: '#f1f5f9', fontWeight: 600, display: 'block' }}>
          {seats === 0 ? 'Bar' : `${seats}-Seat`}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
          {shape} · Drag to canvas
        </Typography>
      </Box>
    </Box>
  );
};

// ─── Placed Table on Canvas ───────────────────────────────────────────────────
interface PlacedTableProps {
  table: LayoutTable;
  onRemove: (id: string) => void;
  statusColor: string;
}

const PlacedTable: React.FC<PlacedTableProps> = ({ table, onRemove, statusColor }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `placed-${table.id}`,
    data: { type: 'placed', tableId: table.id },
  });

  const size = table.seats <= 2 ? 56 : table.seats <= 4 ? 68 : table.seats <= 6 ? 80 : 90;
  const borderRadius = table.shape === 'Round' ? '50%' : table.shape === 'Square' ? 8 : 4;

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        position: 'absolute',
        left: table.x,
        top: table.y,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 100 : 1,
      }}
    >
      <Tooltip
        title={
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{table.label}</Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>Seats: {table.seats === 0 ? 'Bar' : table.seats}</Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>Area: {table.area}</Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>Shape: {table.shape}</Typography>
          </Box>
        }
        placement="top"
        arrow
      >
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius,
            background: `${statusColor}22`,
            border: `2px solid ${statusColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            position: 'relative',
            '&:hover .remove-btn': { opacity: 1 },
          }}
          {...listeners}
          {...attributes}
        >
          <Typography sx={{ fontSize: '0.6rem', color: statusColor, fontWeight: 700, lineHeight: 1.2 }}>
            {table.label}
          </Typography>
          <Typography sx={{ fontSize: '0.55rem', color: '#94a3b8' }}>
            {table.seats === 0 ? 'Bar' : `${table.seats}s`}
          </Typography>
          <IconButton
            className="remove-btn"
            size="small"
            onClick={(e) => { e.stopPropagation(); onRemove(table.id); }}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              opacity: 0,
              transition: 'opacity 0.2s',
              width: 20,
              height: 20,
              background: '#f44336',
              color: '#fff',
              '&:hover': { background: '#d32f2f' },
            }}
          >
            <DeleteIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
};

// ─── Droppable Canvas ─────────────────────────────────────────────────────────
interface DropCanvasProps {
  areaId: AreaType;
  tables: LayoutTable[];
  onRemove: (id: string) => void;
  statusColors: Record<string, string>;
  isOver: boolean;
}

const DropCanvas: React.FC<DropCanvasProps> = ({ areaId, tables, onRemove, statusColors, isOver }) => {
  const { setNodeRef } = useDroppable({ id: `canvas-${areaId}`, data: { area: areaId } });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: 300,
        background: isOver ? 'rgba(249,115,22,0.04)' : 'rgba(15,23,42,0.4)',
        border: `2px dashed ${isOver ? '#f97316' : '#334155'}`,
        borderRadius: 2,
        transition: 'all 0.2s',
        overflow: 'hidden',
      }}
    >
      {tables.length === 0 && !isOver && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 32 }}>🪑</Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Drag tables here
          </Typography>
        </Box>
      )}
      {tables.map((table) => (
        <PlacedTable
          key={table.id}
          table={table}
          onRemove={onRemove}
          statusColor={statusColors[table.status] || '#4caf50'}
        />
      ))}
    </Box>
  );
};

// ─── DragOverlay Ghost ────────────────────────────────────────────────────────
const DragGhost: React.FC<{ seats: number; shape: TableShape }> = ({ seats, shape }) => {
  const size = seats <= 2 ? 56 : seats <= 4 ? 68 : seats <= 6 ? 80 : 90;
  const borderRadius = shape === 'Round' ? '50%' : shape === 'Square' ? 8 : 4;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius,
        background: 'rgba(249,115,22,0.3)',
        border: '2px solid #f97316',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.85,
        pointerEvents: 'none',
      }}
    >
      <Typography sx={{ fontSize: '0.6rem', color: '#f97316', fontWeight: 700 }}>
        {seats === 0 ? 'Bar' : `${seats}s`}
      </Typography>
    </Box>
  );
};

// ─── Main LayoutCanvas Component ──────────────────────────────────────────────
interface LayoutCanvasProps {
  areas: AreaType[];
  tables: LayoutTable[];
  tableShape: TableShape;
  labelPrefix: string;
  statusColors: Record<string, string>;
  distribution: Record<string, number>;
  onTablesChange: (tables: LayoutTable[]) => void;
}

const LayoutCanvas: React.FC<LayoutCanvasProps> = ({
  areas,
  tables,
  tableShape,
  labelPrefix,
  statusColors,
  distribution,
  onTablesChange,
}) => {
  const [activeData, setActiveData] = useState<{
    seats: number;
    shape: TableShape;
  } | null>(null);
  const [overCanvasId, setOverCanvasId] = useState<string | null>(null);
  const canvasRefs = useRef<Record<string, DOMRect | null>>({});
  const counterRef = useRef<number>(tables.length);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === 'sidebar') {
      setActiveData({ seats: data.seats, shape: data.shape });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const over = event.over;
    if (over && String(over.id).startsWith('canvas-')) {
      setOverCanvasId(String(over.id));
    } else {
      setOverCanvasId(null);
    }
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveData(null);
      setOverCanvasId(null);

      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      // Dropping from sidebar into a canvas area
      if (activeData?.type === 'sidebar' && String(over.id).startsWith('canvas-')) {
        const area = overData?.area as AreaType;
        if (!area) return;

        // Calculate drop position relative to canvas
        const canvasEl = document.getElementById(`canvas-${area}`);
        if (!canvasEl) return;
        const rect = canvasEl.getBoundingClientRect();
        const delta = event.delta;
        const initialRect = active.rect.current.initial;
        if (!initialRect) return;

        const x = Math.max(10, Math.round(initialRect.left - rect.left + delta.x));
        const y = Math.max(10, Math.round(initialRect.top - rect.top + delta.y));

        counterRef.current += 1;
        const idx = counterRef.current;
        const label = `${activeData.labelPrefix || labelPrefix}-${String(idx).padStart(2, '0')}`;

        const newTable: LayoutTable = {
          id: `table-${Date.now()}-${idx}`,
          label,
          x: Math.min(x, 280),
          y: Math.min(y, 220),
          seats: activeData.seats,
          status: 'available',
          area,
          shape: activeData.shape,
        };

        onTablesChange([...tables, newTable]);
      }

      // Moving a placed table within/between canvases (future enhancement)
    },
    [tables, onTablesChange, labelPrefix]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onTablesChange(tables.filter((t) => t.id !== id));
    },
    [tables, onTablesChange]
  );

  // Build sidebar items from distribution
  const sidebarItems: { seats: number; count: number }[] = [
    { seats: 2, count: distribution.twoSeater || 0 },
    { seats: 4, count: distribution.fourSeater || 0 },
    { seats: 6, count: distribution.sixSeater || 0 },
    { seats: 8, count: distribution.eightSeater || 0 },
    { seats: 0, count: distribution.bar || 0 }, // bar stool = 0 seats sentinel
  ].filter((item) => item.count > 0);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
        {/* Sidebar */}
        <Box sx={{ width: 160, flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: 'rgba(30,41,59,0.7)',
              border: '1px solid #334155',
              height: '100%',
            }}
          >
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mb: 2, display: 'block' }}>
              TABLE TYPES
            </Typography>
            {sidebarItems.map(({ seats }) => (
              <SidebarItem
                key={`${seats}`}
                seats={seats}
                shape={tableShape}
                area={areas[0]}
                labelPrefix={labelPrefix}
              />
            ))}
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.65rem', mt: 2, display: 'block' }}>
              Drag items onto the canvas below
            </Typography>
          </Paper>
        </Box>

        {/* Canvas areas */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
          {areas.map((area) => {
            const areaTables = tables.filter((t) => t.area === area);
            const isOver = overCanvasId === `canvas-${area}`;
            return (
              <Box key={area}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#f97316', fontWeight: 700 }}>
                    {area}
                  </Typography>
                  <Chip
                    label={`${areaTables.length} tables`}
                    size="small"
                    sx={{
                      height: 20,
                      background: areaTables.length > 0 ? 'rgba(76,175,80,0.2)' : 'rgba(100,116,139,0.2)',
                      color: areaTables.length > 0 ? '#4caf50' : '#64748b',
                      fontSize: '0.65rem',
                    }}
                  />
                </Box>
                <Box id={`canvas-${area}`}>
                  <DropCanvas
                    areaId={area}
                    tables={areaTables}
                    onRemove={handleRemove}
                    statusColors={statusColors}
                    isOver={isOver}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Drag overlay ghost */}
      <DragOverlay dropAnimation={null}>
        {activeData && (
          <DragGhost seats={activeData.seats} shape={activeData.shape} />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default LayoutCanvas;
