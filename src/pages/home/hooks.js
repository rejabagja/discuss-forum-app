import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsersThreads } from '@states/combine';
import { setSelectedCategory } from '@states/categories';
import {
  upVoteThreads,
  downVoteThreads,
  neutralVoteThreads,
} from '@states/threads';


const useHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: users } = useSelector(({ users }) => users);
  const { data: threads } = useSelector(({ threads }) => threads);
  const { categories, authUser } = useSelector(({ categories, authUser }) => ({ categories, authUser: authUser.data }));
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
    dispatch(fetchUsersThreads());
  }, [dispatch]);

  return { authUser, threadList, categories, handleUpVote, handleDownVote, toggleSelectedCategory };
};

export { useHome };