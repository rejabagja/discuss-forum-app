import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPreloadData } from '@states/thunks';
import PropTypes from 'prop-types';

const PreloadDataProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const promise = dispatch(fetchPreloadData());
    promise
      .unwrap()
      .catch((error) => {
        if (isMounted && error.name !== 'AbortError') setError(error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      promise?.abort();
      isMounted = false;
    };
  }, [dispatch]);

  if (error) return <p>{error.message}</p>;
  if (loading) return null;
  return children;
};

PreloadDataProvider.propTypes = {
  children: PropTypes.node,
};

export default PreloadDataProvider;
