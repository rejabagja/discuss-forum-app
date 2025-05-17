import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preloadProcess } from '@states/thunks';
import LayoutApp from '@layouts/App';
import PageNotFound from '@pages/not-found';
import PageThreadCreate from '@pages/thread-create';

import PublicRoutes from './PublicRoutes';
import AuthRoutes from './AuthRoutes';

import RequireAuth from './guards/RequireAuth';
import GuestOnly from './guards/GuestOnly';
import PageOffline from '@components/PageOffline';

const AppRoutes = () => {
  const preload = useSelector(({ preload }) => preload);
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    dispatch(preloadProcess());
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (preload) return null;

  if (!isOnline) {
    return <PageOffline />;
  }

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
