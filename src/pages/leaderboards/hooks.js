import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaderboards } from '@states/thunks';

const useLeaderboards = () => {
  const dispatch = useDispatch();
  const [fetchDataError, setFetchDataError] = useState(null);
  const [fetchDataLoading, setFetchDataLoading] = useState(true);
  const leaderboards = useSelector(({ leaderboards }) => leaderboards.data);

  useEffect(() => {
    let isMounted = true;

    const promise = dispatch(fetchLeaderboards());
    promise
      .unwrap()
      .catch((error) => {
        if (isMounted && error.name !== 'AbortError') setFetchDataError(error);
      })
      .finally(() => {
        if (isMounted) setFetchDataLoading(false);
      });

    return () => {
      promise?.abort();
      isMounted = false;
    };
  }, [dispatch]);

  return { leaderboards, fetchDataError, fetchDataLoading };
};

export { useLeaderboards };