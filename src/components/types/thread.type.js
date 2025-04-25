import PropTypes from 'prop-types';


export const UserShape = {
  id: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  avatar: PropTypes.string,
};

const nullableUser = PropTypes.oneOfType([PropTypes.shape(UserShape), PropTypes.oneOf([null])]);

export const ThreadShape = {
  id: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  category: PropTypes.string,
  createdAt: PropTypes.string,
  ownerId: PropTypes.string,
  upVotesBy: PropTypes.arrayOf(PropTypes.string),
  downVotesBy: PropTypes.arrayOf(PropTypes.string),
  totalComments: PropTypes.number,
};

const nullableThread = PropTypes.oneOfType([PropTypes.shape(ThreadShape), PropTypes.oneOf([null])]);

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

export const TypeThreadCommentInput = {
  authUser: nullableUser,
  value: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
  addCommentHandler: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export const TypeThreadCommentList = {
  thread: nullableThread,
  handleUpVote: PropTypes.func.isRequired,
  handleDownVote: PropTypes.func.isRequired,
  authUser: nullableUser
};

export const CommentShape = {
  id: PropTypes.string,
  content: PropTypes.string,
  createdAt: PropTypes.string,
  owner: PropTypes.shape({
    id: UserShape.id,
    name: UserShape.name,
    avatar: UserShape.avatar
  }),
  upVotesBy: PropTypes.arrayOf(PropTypes.string),
  downVotesBy: PropTypes.arrayOf(PropTypes.string),
};

export const TypeThreadCommentItem = {
  comment: PropTypes.shape(CommentShape).isRequired,
  handleUpVote: PropTypes.func.isRequired,
  handleDownVote: PropTypes.func.isRequired,
  authUser: nullableUser
};

export const TypeThreadDetailContent = {
  thread: PropTypes.shape({
    id: ThreadShape.id,
    title: ThreadShape.title,
    body: ThreadShape.body,
    category: ThreadShape.category,
    createdAt: ThreadShape.createdAt,
    owner: PropTypes.shape({
      id: UserShape.id,
      name: UserShape.name,
      avatar: UserShape.avatar
    }),
    upVotesBy: ThreadShape.upVotesBy,
    downVotesBy: ThreadShape.downVotesBy,
    comments: PropTypes.arrayOf(PropTypes.shape(CommentShape)),
  }).isRequired,
  authUser: nullableUser,
  handleUpVote: PropTypes.func.isRequired,
  handleDownVote: PropTypes.func.isRequired,
};