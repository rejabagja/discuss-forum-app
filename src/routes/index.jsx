import { Routes, Route } from 'react-router-dom';
import LayoutApp from '@layouts/App';
import PageNotFound from '@pages/not-found';
import PageThreadCreate from '@pages/thread-create';

import PublicRoutes from './PublicRoutes';
import AuthRoutes from './AuthRoutes';

import RequireAuth from './guards/RequireAuth';
import GuestOnly from './guards/GuestOnly';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<LayoutApp />}>
        {PublicRoutes}
        <Route element={<GuestOnly />}>{AuthRoutes}</Route>
        <Route element={<RequireAuth />}>
          <Route path="/create" element={<PageThreadCreate />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
