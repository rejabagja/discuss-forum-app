import { fetchLeaderboards } from '@states/leaderboards';
import { useSelector } from 'react-redux';
import { useFetchData } from '@hooks';
import { ErrorType } from '@constants';

const useLeaderboards = () => {
  const { error: fetchDataError, isLoading: fetchDataLoading } = useFetchData([fetchLeaderboards]);
  const leaderboards = useSelector(({ leaderboards }) => leaderboards.data);
  const authUser = useSelector(({ authUser }) => authUser.data);

  return { leaderboards, fetchDataError, fetchDataLoading, authUser, ErrorType };
};

export { useLeaderboards };