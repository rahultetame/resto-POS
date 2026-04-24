import cls from './DateBadge.module.scss';

type DateBadgeProps = {
  date?: Date;
};

const DateBadge = ({ date = new Date() }: DateBadgeProps) => (
  <time className={cls.badge} dateTime={date.toISOString()}>
    <span className={cls.badge__day}>{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
    <span className={cls.badge__date}>{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
  </time>
);

export default DateBadge;
