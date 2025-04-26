export const VoteType = {
  UP_VOTE: 'up-vote',
  DOWN_VOTE: 'down-vote',
  NEUTRAL_VOTE: 'neutral-vote',
};

export const ErrorType = {
  FETCH_DATA: 'FETCH_DATA',
  CREATE_COMMENT: 'CREATE_COMMENT',
  CREATE_THREAD: 'CREATE_THREAD',
  LOGIN: 'LOGIN',
  CREATE_USER: 'CREATE_USER',
  VOTE_THREAD: 'VOTE_THREAD',
  VOTE_COMMENT: 'VOTE_COMMENT',
};

export const BASE_URL = import.meta.env.VITE_BASE_API_URL;
