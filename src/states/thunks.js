import { fetchUsers } from './users';
import { fetchThreads } from './threads';
import { fetchLeaderboards } from './leaderboards';
import { fetchThread } from './thread-detail';
import { showLoading, hideLoading } from 'react-redux-loading-bar';


export const fetchHomeData = () => async (dispatch) => {
  try {
    dispatch(showLoading());
    await Promise.all([dispatch(fetchUsers()), dispatch(fetchThreads())]);
  } catch (error) {
    console.log(error?.message || error);
    alert(error?.message || error);
  } finally {
    dispatch(hideLoading());
  }
};

export const fetchThreadCreateData = () => async (dispatch) => {
  try {
    dispatch(showLoading());
    await dispatch(fetchThreads());
  } catch (error) {
    console.log(error?.message || error);
    alert(error?.message || error);
  } finally {
    dispatch(hideLoading());
  }
};

export const fetchLeaderboardsData = () => async (dispatch) => {
  try {
    dispatch(showLoading());
    await dispatch(fetchLeaderboards());
  } catch (error) {
    console.log(error?.message || error);
    alert(error?.message || error);
  } finally {
    dispatch(hideLoading());
  }
};

export const fetchThreadDetailData = (threadId) => async (dispatch) => {
  try {
    dispatch(showLoading());
    await dispatch(fetchThread(threadId));
  } catch (error) {
    console.log(error?.message || error);
    alert(error?.message || error);
  } finally {
    dispatch(hideLoading());
  }
};