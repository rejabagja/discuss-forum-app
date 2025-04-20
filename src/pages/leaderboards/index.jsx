import { useLeaderboards } from './hooks';
import LeaderboardList from '@components/LeaderboardList';

const PageLeaderboards = () => {
  const { leaderboards, error, authUser } = useLeaderboards();

  if (error) return <div>{error}</div>;
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
