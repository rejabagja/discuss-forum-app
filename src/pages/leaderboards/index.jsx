import { useLeaderboards } from './hooks';
import {
  LeaderboardList,
  FetchDataError,
  LeaderboardItemSkeleteon,
} from '@components';

const PageLeaderboards = () => {
  const { leaderboards, fetchDataError, fetchDataLoading } = useLeaderboards();

  if (fetchDataError) return <FetchDataError error={fetchDataError} />;

  return (
    <section className="leaderboards-page">
      <h2 className="font-semibold text-xl mb-4">Active User Leaderboards</h2>
      <div className="leaderboards-page__content px-2">
        <header className="flex flex-row justify-between font-medium text-lg mb-4">
          <span>User</span>
          <span>Score</span>
        </header>
        {fetchDataLoading && leaderboards.length === 0 && (
          <LeaderboardItemSkeleteon />
        )}
        <LeaderboardList leaderboards={leaderboards} />
      </div>
    </section>
  );
};

export default PageLeaderboards;
