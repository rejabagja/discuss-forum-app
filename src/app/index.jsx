import AppRoutes from '@routes';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preloadProcess } from '@states/thunks';
import PageOffline from '@components/PageOffline';

function App() {
  const dispatch = useDispatch();
  const preload = useSelector(({ preload }) => preload);
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

  return <AppRoutes />;
}

export default App;
