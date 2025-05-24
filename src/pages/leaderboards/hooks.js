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

    const fetchLeaderboardsController = new AbortController();
    dispatch(fetchLeaderboards({ signal: fetchLeaderboardsController.signal }))
      .unwrap()
      .catch((error) => {
        if (isMounted) setFetchDataError(error);
      })
      .finally(() => {
        if (isMounted) setFetchDataLoading(false);
      });

    return () => {
      fetchLeaderboardsController?.abort();
      isMounted = false;
    };
  }, [dispatch]);

  return { leaderboards, fetchDataError, fetchDataLoading };
};

export { useLeaderboards };