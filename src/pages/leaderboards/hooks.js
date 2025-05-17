import { useSelector } from 'react-redux';
import { useFetchData } from '@hooks';
import { fetchLeaderboards } from '@states/thunks';

const useLeaderboards = () => {
  const { error: fetchDataError, isLoading: fetchDataLoading } = useFetchData([fetchLeaderboards]);
  const leaderboards = useSelector(({ leaderboards }) => leaderboards.data);
  const authUser = useSelector(({ authUser }) => authUser.data);

  return { leaderboards, fetchDataError, fetchDataLoading, authUser };
};

export { useLeaderboards };