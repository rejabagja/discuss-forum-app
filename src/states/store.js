import { configureStore } from '@reduxjs/toolkit';
import authUser from './auth-user';
import preload from './preload';
import categories from './categories';
import leaderboards from './leaderboards';
import threadDetail from './thread-detail';
import threads from './threads';
import users from './users';
import theme from './theme';
import { loadingBarReducer } from 'react-redux-loading-bar';

const store = configureStore({
  reducer: {
    authUser, preload, categories, leaderboards, threadDetail, threads, users, theme,
    loadingBar: loadingBarReducer
  },
});

export default store;