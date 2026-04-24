import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import cls from './DataTable.module.scss';

export type DataColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: DataColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
};

const DataTable = <T,>({ columns, rows, getRowId }: DataTableProps<T>) => (
  <TableContainer className={cls.table}>
    <Table>
      <TableHead className={cls.table__head}>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={String(column.key)}>{column.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow hover key={getRowId(row)}>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>
                {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DataTable;
