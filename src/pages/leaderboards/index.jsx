import { useLeaderboards } from './hooks';
import LeaderboardList from '@components/LeaderboardList';
import FetchDataError from '@components/FetchDataError';

const PageLeaderboards = () => {
  const {
    leaderboards,
    fetchDataError,
    fetchDataLoading,
    authUser,
    ErrorType,
  } = useLeaderboards();

  if (fetchDataError?.type === ErrorType.FETCH_DATA)
    return <FetchDataError error={fetchDataError} />;

  if (fetchDataLoading && leaderboards.length === 0) return null;

  return (
    <section className="leaderboards-page">
      <h2 className="font-semibold text-xl mb-4">Active User Leaderboards</h2>
      <div className="leaderboards-page__content px-2">
        <LeaderboardList leaderboards={leaderboards} authUser={authUser} />
      </div>
    </section>
  );
};

export default PageLeaderboards;
