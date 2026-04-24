import cls from './SalesChart.module.scss';

type SalesChartProps = {
  values: number[];
};

const SalesChart = ({ values }: SalesChartProps) => {
  const max = Math.max(...values, 1);

  return (
    <div className={cls.chart} aria-label="Weekly sales chart">
      {values.map((value, index) => (
        <div
          aria-label={`Day ${index + 1}: ${value}`}
          className={cls.chart__bar}
          key={`${value}-${index}`}
          style={{ height: `${Math.max((value / max) * 100, 16)}%` }}
        />
      ))}
    </div>
  );
};

export default SalesChart;
