import LeaderboardItem from './LeaderboardItem';
import { TypeLeaderboardList } from './types/leaderboard.type';

const LeaderboardList = ({ leaderboards }) => {
  return (
    <div className="flex flex-col gap-5">
      {leaderboards.map((board, index) => {
        return (
          <LeaderboardItem key={board.user.id} {...board} order={index + 1} />
        );
      })}
    </div>
  );
};

LeaderboardList.propTypes = TypeLeaderboardList;

export default LeaderboardList;
