import type { ReactNode } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import KioskLayout from '../layouts/KioskLayout';
import MainLayout from '../layouts/MainLayout';
import { LazyPath } from './LazyPath';
import { PATH } from './path';

export type AppRoute = {
  path?: string;
  element: ReactNode;
  children?: AppRoute[];
};

export const publicRoutes: AppRoute[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: PATH.LOGIN, element: <LazyPath.Login /> },
      { path: PATH.REGISTER, element: <LazyPath.Register /> },
    ],
  },
];

export const privateRoutes: AppRoute[] = [
  {
    element: <MainLayout />,
    children: [
      { path: PATH.DASHBOARD, element: <LazyPath.Dashboard /> },
      { path: PATH.POS, element: <LazyPath.OrderScreen /> },

      // ✅ NEW ROUTE
      {
        path: PATH.RESTAURANT_LAYOUT,
        element: <LazyPath.RestaurantLayout />,
      },
    ],
  },
];

export const kioskRoutes: AppRoute[] = [
  {
    element: <KioskLayout />,
    children: [{ path: PATH.KIOSK, element: <LazyPath.KioskScreen /> }],
  },
];
