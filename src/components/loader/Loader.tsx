import { CircularProgress } from '@mui/material';
import cls from './Loader.module.scss';

type LoaderProps = {
  screen?: boolean;
};

const Loader = ({ screen }: LoaderProps) => (
  <div className={[cls.loader, screen ? cls['loader--screen'] : ''].join(' ').trim()}>
    <CircularProgress color="inherit" />
  </div>
);

export default Loader;
