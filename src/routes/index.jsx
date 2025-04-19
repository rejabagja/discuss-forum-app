import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preloadProcess } from '@states/preload';
import LayoutApp from '@layouts/App';
import PreloadLoader from '@components/PreloadLoader';

import PublicRoutes from './PublicRoutes';
import AuthRoutes from './AuthRoutes';

import RequireAuth from './guards/RequireAuth';
import GuestOnly from './guards/GuestOnly';

const AppRoutes = () => {
  const preload = useSelector(({ preload }) => preload);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(preloadProcess());
  }, [dispatch]);

  if (preload.isLoading) return <PreloadLoader />;

  return (
    <Routes>
      <Route element={<LayoutApp />}>
        {PublicRoutes}

        <Route element={<GuestOnly />}>{AuthRoutes}</Route>

        <Route element={<RequireAuth />}>
          <Route
            path="/threads/create"
            element={<p>Create New Thread Page</p>}
          />
        </Route>

        <Route path="*" element={<p>404 Page</p>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
