import { Box, Button, Typography } from '@mui/material';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useLayoutStore } from '../store/useLayoutStore';
import { v4 as uuid } from 'uuid';

const DraggableItem = () => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'new-table',
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        width: 80,
        height: 80,
        background: '#ff4d6d',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        cursor: 'grab',
      }}
    >
      Table
    </Box>
  );
};

const LayoutCanvas = () => {
  const { addTable, setStep, isLayoutValid } = useLayoutStore();

  const handleDragEnd = (event: any) => {
    if (event.over?.id === 'canvas') {
      addTable('Indoor', {
        id: 'T-' + uuid(),
        x: event.delta.x,
        y: event.delta.y,
        seats: 4,
        status: 'Available',
        area: 'Indoor',
      });
    }
  };

  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const handleNext = () => {
    if (!isLayoutValid()) {
      alert('Please place at least one table');
      return;
    }

    setStep(3); // ✅ go to final preview
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box display='flex' gap={2}>
        {/* Sidebar */}
        <Box width={200}>
          <Typography mb={1}>Drag Items</Typography>
          <DraggableItem />
        </Box>

        {/* Canvas */}
        <Box
          ref={setNodeRef}
          id='canvas'
          sx={{
            flex: 1,
            height: 500,
            background: '#1e1f24',
            border: '1px dashed #555',
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Next Button */}
      <Box mt={3} textAlign='right'>
        <Button variant='contained' color='error' onClick={handleNext}>
          Next
        </Button>
      </Box>
    </DndContext>
  );
};

export default LayoutCanvas;
