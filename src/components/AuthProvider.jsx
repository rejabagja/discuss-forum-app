import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '@states/thunks';
import PropTypes from 'prop-types';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const promise = dispatch(fetchCurrentUser());
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

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
