import AppRoutes from '@routes';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preloadProcess } from '@states/thunks';
import LayoutApp from '@layouts/App';

function App() {
  const dispatch = useDispatch();
  const preload = useSelector(({ preload }) => preload);

  useEffect(() => {
    dispatch(preloadProcess());
  }, [dispatch]);

  if (preload) return null;

  return (
    <LayoutApp>
      <AppRoutes />
    </LayoutApp>
  );
}

export default App;
