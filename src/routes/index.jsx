import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preloadProcess } from '@states/preload';
import LayoutApp from '@layouts/App';
import PageNotFound from '@pages/404-not-found';
import PreloadLoader from '@components/PreloadLoader';
import PageThreadCreate from '@pages/thread-create';

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

  // if (preload.isLoading) return <PreloadLoader />;
  if (preload.isLoading) return null;

  return (
    <Routes>
      <Route element={<LayoutApp />}>
        {PublicRoutes}

        <Route element={<GuestOnly />}>{AuthRoutes}</Route>

        <Route element={<RequireAuth />}>
          <Route path="/threads/create" element={<PageThreadCreate />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
