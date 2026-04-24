import cls from './MetricCard.module.scss';

type MetricCardProps = {
  label: string;
  value: string;
  trend?: string;
};

const MetricCard = ({ label, value, trend }: MetricCardProps) => (
  <article className={cls.card}>
    <p className={cls.card__label}>{label}</p>
    <p className={cls.card__value}>{value}</p>
    {trend ? <span className={cls.card__trend}>{trend}</span> : null}
  </article>
);

export default MetricCard;
