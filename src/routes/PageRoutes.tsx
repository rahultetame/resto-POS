import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from '../components/loader/Loader';
import { useAppSelector } from '../hooks/useAppSelector';
import { Suspense, type ReactNode } from 'react';
import { kioskRoutes, privateRoutes, publicRoutes, type AppRoute } from './routes';
import { PATH } from './path';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.login.token);
  const location = useLocation();

  if (!token) {
    return <Navigate replace state={{ from: location }} to={PATH.LOGIN} />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.login.token);

  if (token) {
    return <Navigate replace to={PATH.DASHBOARD} />;
  }

  return children;
};

const renderRoute = (route: AppRoute, guard?: 'public' | 'private') => {
  const element =
    guard === 'private' ? (
      <ProtectedRoute>{route.element}</ProtectedRoute>
    ) : guard === 'public' ? (
      <PublicRoute>{route.element}</PublicRoute>
    ) : (
      route.element
    );

  return (
    <Route element={element} key={`${route.path ?? 'layout'}-${guard ?? 'open'}`} path={route.path}>
      {route.children?.map((child) => renderRoute(child))}
    </Route>
  );
};

const PageRoutes = () => (
  <Suspense fallback={<Loader screen />}>
    <Routes>
      <Route element={<Navigate replace to={PATH.DASHBOARD} />} path={PATH.ROOT} />
      {publicRoutes.map((route) => renderRoute(route, 'public'))}
      {privateRoutes.map((route) => renderRoute(route, 'private'))}
      {kioskRoutes.map((route) => renderRoute(route, 'private'))}
      <Route element={<Navigate replace to={PATH.DASHBOARD} />} path="*" />
    </Routes>
  </Suspense>
);

export default PageRoutes;
