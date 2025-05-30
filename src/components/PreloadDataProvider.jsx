import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPreloadData } from '@states/thunks';
import FetchDataError from '@components/FetchDataError';
import PropTypes from 'prop-types';

const PreloadDataProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPreloadDataController = new AbortController();
    dispatch(fetchPreloadData({ signal: fetchPreloadDataController.signal }))
      .unwrap()
      .catch((error) => {
        if (isMounted) setError(error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      fetchPreloadDataController?.abort();
      isMounted = false;
    };
  }, [dispatch]);

  if (error) return <FetchDataError error={error} />;
  if (loading)
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <span className="loading loading-bars loading-md lg:loading-lg text-accent-darker"></span>
      </div>
    );
  return children;
};

PreloadDataProvider.propTypes = {
  children: PropTypes.node,
};

export default PreloadDataProvider;
