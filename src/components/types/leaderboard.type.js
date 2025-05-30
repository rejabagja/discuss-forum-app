import PropTypes from 'prop-types';
import { UserShape } from './thread.type';


export const LeaderboardsShape = {
  user: PropTypes.shape(UserShape).isRequired,
  score: PropTypes.number.isRequired,
};

export const TypeLeaderboardList = {
  leaderboards: PropTypes.arrayOf(PropTypes.shape(LeaderboardsShape)).isRequired,
};

export const TypeLeaderboardItem = {
  ...LeaderboardsShape,
  order: PropTypes.number.isRequired,
};