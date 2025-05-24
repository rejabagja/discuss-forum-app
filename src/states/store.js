import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/auth';
import categories from './slices/categories';
import leaderboards from './slices/leaderboards';
import threadDetail from './slices/thread-detail';
import threads from './slices/threads';
import users from './slices/users';
import theme from './slices/theme';
import { loadingBarReducer } from 'react-redux-loading-bar';

const store = configureStore({
  reducer: {
    auth, categories, leaderboards, threadDetail, threads, users, theme,
    loadingBar: loadingBarReducer
  },
});

export default store;