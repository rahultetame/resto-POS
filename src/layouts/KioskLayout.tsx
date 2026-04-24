import { Outlet } from 'react-router-dom';
import cls from './KioskLayout.module.scss';

const KioskLayout = () => (
  <main className={cls.kiosk}>
    <Outlet />
  </main>
);

export default KioskLayout;
