import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaderboardsData } from '@states/thunks';

const useLeaderboards = () => {
  const dispatch = useDispatch();
  const { data: leaderboards, error } = useSelector(({ leaderboards }) => leaderboards);
  const authUser = useSelector(({ authUser }) => authUser.data);
  useEffect(() => {
    dispatch(fetchLeaderboardsData());
  }, [dispatch]);
  return { leaderboards, error, authUser };
};

export { useLeaderboards };