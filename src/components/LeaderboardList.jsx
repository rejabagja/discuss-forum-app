import LeaderboardItem from './LeaderboardItem';
import { TypeLeaderboardList } from './types/leaderboard.type';

const LeaderboardList = ({ leaderboards, authUser }) => {
  return (
    <>
      <header className="flex flex-row justify-between font-medium text-lg mb-4">
        <span>User</span>
        <span>Score</span>
      </header>
      <div className="flex flex-col gap-5">
        {leaderboards.map((board, index) => {
          const boardWithAuthUser = { ...board, authUser };
          return (
            <LeaderboardItem
              key={board.user.id}
              {...boardWithAuthUser}
              order={index + 1}
            />
          );
        })}
      </div>
    </>
  );
};

LeaderboardList.propTypes = TypeLeaderboardList;

export default LeaderboardList;
