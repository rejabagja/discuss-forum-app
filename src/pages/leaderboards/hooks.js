import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaderboards } from '@states/leaderboards';

const useLeaderboards = () => {
  const dispatch = useDispatch();
  const { data: leaderboards, error } = useSelector(({ leaderboards }) => leaderboards);
  const authUser = useSelector(({ authUser }) => authUser.data);
  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);
  return { leaderboards, error, authUser };
};

export { useLeaderboards };