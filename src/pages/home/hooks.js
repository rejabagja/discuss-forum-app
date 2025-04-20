import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '@states/users';
import { setSelectedCategory } from '@states/categories';
import {
  upVoteThreads,
  downVoteThreads,
  neutralVoteThreads,
  fetchThreads,
} from '@states/threads';


const useHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, categories, authUser, threads } = useSelector(
    ({ users, categories, authUser, threads }) => ({
      users: users.data,
      categories,
      authUser: authUser.data,
      threads
    })
  );
  const threadList = threads.map((thread) => ({
    ...thread,
    owner: users.find((user) => user.id === thread.ownerId),
    authUser
  }));

  const toggleSelectedCategory = (category) => {
    if (category === categories.selectedCategory) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(category));
    }
  };
  const handleUpVote = (thread) => {
    if (!authUser) return navigate('/login');
    if (thread.upVotesBy.includes(thread.authUser.id)) {
      dispatch(
        neutralVoteThreads({ threadId: thread.id, userId: thread.authUser.id })
      );
    } else {
      dispatch(
        upVoteThreads({ threadId: thread.id, userId: thread.authUser.id })
      );
    }
  };
  const handleDownVote = (thread) => {
    if (!authUser) return navigate('/login');
    if (thread.downVotesBy.includes(thread.authUser.id)) {
      dispatch(
        neutralVoteThreads({ threadId: thread.id, userId: thread.authUser.id })
      );
    } else {
      dispatch(
        downVoteThreads({ threadId: thread.id, userId: thread.authUser.id })
      );
    }
  };

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchThreads());
  }, [dispatch]);

  return { authUser, threadList, categories, handleUpVote, handleDownVote, toggleSelectedCategory };
};

export { useHome };