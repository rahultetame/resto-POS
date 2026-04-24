import { Chip, Skeleton } from '@mui/material';
import SalesChart from '../../components/charts/SalesChart';
import MetricCard from '../../components/cards/MetricCard';
import DataTable, { type DataColumn } from '../../components/table/DataTable';
import cls from './Dashboard.module.scss';

type OrderRow = {
  id: string;
  table: string;
  server: string;
  total: string;
  status: string;
};

const rows: OrderRow[] = [
  { id: 'ORD-1024', table: 'T-08', server: 'Aarav', total: '$86.40', status: 'Preparing' },
  { id: 'ORD-1025', table: 'T-02', server: 'Mira', total: '$42.10', status: 'Served' },
  { id: 'ORD-1026', table: 'Takeaway', server: 'Nina', total: '$28.90', status: 'Ready' },
];

const columns: DataColumn<OrderRow>[] = [
  { key: 'id', label: 'Order' },
  { key: 'table', label: 'Table' },
  { key: 'server', label: 'Server' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status', render: (row) => <Chip label={row.status} size="small" /> },
];

const Dashboard = () => (
  <section className="page">
    <div className="page__header">
      <div>
        <h1 className="page__title">Dashboard</h1>
        <p className="page__subtitle">Live operating view for orders, sales, and front-of-house momentum.</p>
      </div>
    </div>
    <div className={cls.metrics}>
      <MetricCard label="Today sales" value="$4,892" trend="+12.4%" />
      <MetricCard label="Open orders" value="38" trend="+6 active" />
      <MetricCard label="Avg ticket" value="$31.20" trend="+4.1%" />
      <MetricCard label="Kitchen SLA" value="14m" trend="On target" />
    </div>
    <div className={cls['dashboard-grid']}>
      <div className={cls.panel}>
        <h2 className={cls.panel__title}>Weekly Sales</h2>
        <SalesChart values={[42, 58, 76, 64, 92, 117, 98]} />
      </div>
      <div className={cls.panel}>
        <h2 className={cls.panel__title}>Demand Forecast</h2>
        <Skeleton height={54} variant="rounded" />
        <Skeleton height={54} variant="rounded" />
        <Skeleton height={54} variant="rounded" />
      </div>
    </div>
    <DataTable columns={columns} getRowId={(row) => row.id} rows={rows} />
  </section>
);

export default Dashboard;
