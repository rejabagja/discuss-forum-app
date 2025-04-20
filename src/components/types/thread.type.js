import PropTypes from 'prop-types';


export const UserShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

const nullableUser = PropTypes.oneOfType([PropTypes.shape(UserShape), PropTypes.oneOf([null])]);

export const ThreadShape = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalComments: PropTypes.number.isRequired,
};

export const ThreadsShape = {
  ...ThreadShape,
  owner: nullableUser,
  authUser: nullableUser,
};

export const TypeThreadList = {
  threads: PropTypes.arrayOf(PropTypes.shape(ThreadsShape)).isRequired,
  handleUpVote: PropTypes.func.isRequired,
  handleDownVote: PropTypes.func.isRequired,
};

export const TypeThreadItem = {
  thread: PropTypes.shape(ThreadsShape).isRequired,
  upVote: PropTypes.func.isRequired,
  downVote: PropTypes.func.isRequired,
};
