// Dashboard.tsx

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
import Groups2Icon from '@mui/icons-material/Groups2';
import EventIcon from '@mui/icons-material/Event';
import cls from './Dashboard.module.scss';

type TableStatus =
  | 'Available'
  | 'Occupied'
  | 'Order Placed'
  | 'Order Served'
  | 'Ready For Billing'
  | 'Paid'
  | 'Reserved';

type TableItem = {
  id: string;
  seats: number;
  status: TableStatus;
  duration?: string;
  waiter?: string;
  shape?: 'square' | 'rectangle' | 'round';
  size?: 'sm' | 'md' | 'lg';
};

const STATUS_COLORS: Record<TableStatus, string> = {
  Available: '#1BCB63',
  Occupied: '#F4B740',
  'Order Placed': '#FF7A1A',
  'Order Served': '#3D73F5',
  'Ready For Billing': '#A52CF5',
  Paid: '#A3F01A',
  Reserved: '#FF1D25',
};

const tables: TableItem[] = [
  {
    id: 'T1',
    seats: 6,
    status: 'Available',
    duration: '00:00',
    shape: 'square',
    size: 'md',
  },
  {
    id: 'T2',
    seats: 5,
    status: 'Occupied',
    duration: '50:12',
    shape: 'square',
    size: 'md',
  },
  {
    id: 'T3',
    seats: 6,
    status: 'Available',
    duration: '00:00',
    shape: 'square',
    size: 'md',
  },
  {
    id: 'T4',
    seats: 6,
    status: 'Order Served',
    duration: '01:25',
    shape: 'square',
    size: 'md',
  },
  {
    id: 'T5',
    seats: 4,
    status: 'Available',
    duration: '00:00',
    shape: 'square',
    size: 'sm',
  },
  {
    id: 'T6',
    seats: 4,
    status: 'Ready For Billing',
    duration: '01:25',
    shape: 'square',
    size: 'sm',
  },
  {
    id: 'T7',
    seats: 3,
    status: 'Order Placed',
    duration: '01:25',
    shape: 'square',
    size: 'sm',
  },
  {
    id: 'T8',
    seats: 4,
    status: 'Paid',
    duration: '01:25',
    shape: 'square',
    size: 'sm',
  },
  {
    id: 'T9',
    seats: 2,
    status: 'Occupied',
    duration: '01:25',
    shape: 'square',
    size: 'sm',
  },
  {
    id: 'T10',
    seats: 12,
    status: 'Available',
    duration: '00:00',
    shape: 'rectangle',
    size: 'lg',
  },
  {
    id: 'T11',
    seats: 11,
    status: 'Reserved',
    duration: '07:30 PM',
    shape: 'rectangle',
    size: 'lg',
  },
];

const getTableSize = (size?: string) => {
  switch (size) {
    case 'sm':
      return { width: 140, height: 140 };
    case 'lg':
      return { width: 420, height: 160 };
    default:
      return { width: 220, height: 180 };
  }
};

const TableCard = ({ table }: { table: TableItem }) => {
  const color = STATUS_COLORS[table.status];
  const size = getTableSize(table.size);

  return (
    <Tooltip
      arrow
      title={
        <Box>
          <Typography fontWeight={700}>{table.id}</Typography>
          <Typography variant='body2'>Status: {table.status}</Typography>
          <Typography variant='body2'>Seats: {table.seats}</Typography>
          <Typography variant='body2'>Duration: {table.duration}</Typography>
        </Box>
      }
    >
      <Box className={cls.tableWrapper}>
        {/* TOP CHAIRS */}
        <Box className={cls.chairRow}>
          {Array.from({
            length: Math.min(Math.ceil(table.seats / 2), 7),
          }).map((_, i) => (
            <Box
              key={i}
              className={cls.chair}
              sx={{
                backgroundColor: color,
              }}
            />
          ))}
        </Box>

        {/* TABLE */}
        <Box
          className={cls.tableCard}
          sx={{
            width: size.width,
            height: size.height,
            borderLeft: `6px solid ${color}`,
          }}
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Avatar
              sx={{
                bgcolor: `${color}20`,
                color,
                fontWeight: 700,
              }}
            >
              {table.id}
            </Avatar>

            <Stack direction='row' spacing={0.5} alignItems='center'>
              <Groups2Icon fontSize='small' />
              <Typography variant='body2'>{table.seats}</Typography>
            </Stack>
          </Stack>

          <Box mt='auto'>
            <Typography className={cls.statusText}>{table.status}</Typography>

            <Typography className={cls.duration}>
              {table.status === 'Reserved'
                ? `Reserved at ${table.duration}`
                : `Occupied Duration ${table.duration}`}
            </Typography>
          </Box>
        </Box>

        {/* BOTTOM CHAIRS */}
        <Box className={cls.chairRow}>
          {Array.from({
            length: Math.min(Math.ceil(table.seats / 2), 7),
          }).map((_, i) => (
            <Box
              key={i}
              className={cls.chair}
              sx={{
                backgroundColor: color,
              }}
            />
          ))}
        </Box>
      </Box>
    </Tooltip>
  );
};

const Dashboard = () => {
  return (
    <section className={cls.dashboard}>
      {/* HEADER */}
      <Box className={cls.topbar}>
        <Typography variant='h4' fontWeight={700}>
          All Seats
        </Typography>

        <Stack direction='row' spacing={2} alignItems='center'>
          <Button variant='contained' color='error'>
            All Seats
          </Button>

          <Button variant='contained' className={cls.filterBtn}>
            Available Seats
          </Button>

          <Button variant='contained' className={cls.filterBtn}>
            Occupied Seats
          </Button>

          <Button variant='contained' className={cls.filterBtn}>
            Reserved Seats
          </Button>

          <Chip
            icon={<EventIcon />}
            label='11-11-2025'
            className={cls.dateChip}
          />

          <Select size='small' defaultValue='Indoor' className={cls.select}>
            <MenuItem value='Indoor'>Sitting Area Sections</MenuItem>
          </Select>
        </Stack>
      </Box>

      {/* LAYOUT */}
      <Box className={cls.layoutContainer}>
        <Typography className={cls.areaTitle}>Indoor Area</Typography>

        <Box className={cls.tableGrid}>
          {tables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </Box>

        {/* FOOTER */}
        <Box className={cls.footer}>
          {/* LEGEND */}
          <Box>
            <Typography className={cls.legendTitle}>
              Seat Status Code
            </Typography>

            <Stack direction='row' spacing={2} mt={2} flexWrap='wrap'>
              {Object.entries(STATUS_COLORS).map(([key, value]) => (
                <Stack
                  direction='row'
                  spacing={1}
                  alignItems='center'
                  key={key}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: value,
                    }}
                  />

                  <Typography variant='caption'>{key}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* CAPACITY */}
          <Box width='35%'>
            <Stack direction='row' justifyContent='space-between' mb={1}>
              <Typography fontWeight={600}>Actual Capacity</Typography>

              <Typography fontWeight={700}>72%</Typography>
            </Stack>

            <LinearProgress
              variant='determinate'
              value={72}
              sx={{
                height: 10,
                borderRadius: 999,
              }}
            />
          </Box>
        </Box>
      </Box>
    </section>
  );
};

export default Dashboard;
