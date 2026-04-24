import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import type { LayoutTable } from '../store/types';

interface TableCardProps {
  table: LayoutTable;
  statusColor: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  statusColor,
  size = 'md',
  onClick,
}) => {
  const dim = size === 'sm' ? 60 : size === 'md' ? 80 : 100;
  const borderRadius =
    table.shape === 'Round' ? '50%' : table.shape === 'Square' ? dim * 0.12 : dim * 0.08;
  const fontSize = size === 'sm' ? '0.6rem' : size === 'md' ? '0.7rem' : '0.8rem';

  return (
    <Box
      onClick={onClick}
      sx={{
        width: dim,
        height: dim,
        borderRadius,
        background: `${statusColor}18`,
        border: `2.5px solid ${statusColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.25,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        position: 'relative',
        '&:hover': onClick
          ? {
              background: `${statusColor}30`,
              transform: 'scale(1.05)',
              boxShadow: `0 0 16px ${statusColor}44`,
            }
          : {},
      }}
    >
      {/* Status dot */}
      <Box
        sx={{
          position: 'absolute',
          top: size === 'sm' ? 4 : 6,
          right: size === 'sm' ? 4 : 6,
          width: size === 'sm' ? 6 : 8,
          height: size === 'sm' ? 6 : 8,
          borderRadius: '50%',
          background: statusColor,
          boxShadow: `0 0 6px ${statusColor}`,
        }}
      />

      <Typography
        sx={{ fontSize, color: statusColor, fontWeight: 700, lineHeight: 1.2 }}
      >
        {table.label}
      </Typography>
      <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', lineHeight: 1 }}>
        {table.seats === 0 ? 'Bar' : `${table.seats} seats`}
      </Typography>
      {size !== 'sm' && (
        <Typography
          sx={{
            fontSize: '0.55rem',
            color: statusColor,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            mt: 0.25,
          }}
        >
          {table.status}
        </Typography>
      )}
    </Box>
  );
};

export default TableCard;
