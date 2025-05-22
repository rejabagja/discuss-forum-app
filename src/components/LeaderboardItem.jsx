import { leaderboardRingColor } from '@utils';
import { TypeLeaderboardItem } from './types/leaderboard.type';
import { useSelector } from 'react-redux';

const LeaderboardItem = ({ user, score, order }) => {
  const authUser = useSelector(({ auth }) => auth.user);
  return (
    <div key={user.id} className="flex flex-row justify-between items-center">
      <div className="user-avatar flex flex-row items-center gap-3">
        <div className="avatar">
          <div
            className={`ring-offset-base-100 w-8 rounded-full ring ring-offset-2 ring-base-100 ${leaderboardRingColor(
              order
            )}`}
            title={user.name}
          >
            <img src={user.avatar} alt={user.name} />
          </div>
        </div>
        <span className={`${order <= 3 ? 'font-medium' : 'font-normal'}`}>
          {user.name}{' '}
          {user.id === authUser?.id && <span className="italic">(You)</span>}
        </span>
      </div>
      <span className={`${order <= 3 ? 'font-medium' : 'font-normal'}`}>
        {score}
      </span>
    </div>
  );
};

LeaderboardItem.propTypes = TypeLeaderboardItem;

export default LeaderboardItem;
