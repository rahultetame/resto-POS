import { Outlet } from 'react-router-dom';
import cls from './AuthLayout.module.scss';

const AuthLayout = () => (
  <main className={cls.auth}>
    <section className={cls.auth__brand}>
      <h1>Restaurant POS</h1>
      <p>Fast service, clear orders, and confident checkout flows for busy restaurant teams.</p>
    </section>
    <section className={cls.auth__panel}>
      <Outlet />
    </section>
  </main>
);

export default AuthLayout;
