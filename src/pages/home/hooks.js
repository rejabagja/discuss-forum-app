import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '@states/slices/categories';
import {
  upVoteThreads,
  downVoteThreads,
  neutralVoteThreads,
} from '@states/thunks/threads';
import { showAuthRequiredToast } from '@utils';
import { useEffect, useState } from 'react';
import { fetchUsersThreads } from '@states/thunks';


const useHome = () => {
  const dispatch = useDispatch();
  const [fetchDataError, setFetchDataError] = useState(null);
  const [fetchDataLoading, setFetchDataLoading] = useState(true);
  const users = useSelector(({ users }) => users.data);
  const threads = useSelector(({ threads }) => threads.data);
  const authUser = useSelector(({ authUser }) => authUser.data);
  const { data: categories, selectedCategory } = useSelector(({ categories }) => categories);

  const threadList = threads.map((thread) => ({
    ...thread,
    owner: users.find((user) => user.id === thread.ownerId),
    authUser
  }));

  const toggleSelectedCategory = (category) => {
    dispatch(
      category === selectedCategory
        ? setSelectedCategory(null)
        : setSelectedCategory(category)
    );
  };

  const handleUpVote = (thread) => {
    if (!authUser) return showAuthRequiredToast('thread');
    dispatch(
      thread.upVotesBy.includes(authUser.id)
        ? neutralVoteThreads(thread.id)
        : upVoteThreads(thread.id)
    );
  };

  const handleDownVote = (thread) => {
    if (!authUser) return showAuthRequiredToast('thread');
    dispatch(
      thread.downVotesBy.includes(authUser.id)
        ? neutralVoteThreads(thread.id)
        : downVoteThreads(thread.id)
    );
  };

  useEffect(() => {
    let isMounted = true;

    const promise = dispatch(fetchUsersThreads());
    promise
      .unwrap()
      .catch((error) => {
        if (isMounted && error.name !== 'AbortError') {
          setFetchDataError(error);
        }
      })
      .finally(() => {
        if (isMounted) setFetchDataLoading(false);
      });

    return () => {
      promise.abort();
      isMounted = false;
    };
  }, [dispatch]);

  return {
    authUser, threadList,
    categories, selectedCategory,
    handleUpVote, handleDownVote,
    toggleSelectedCategory, fetchDataError, fetchDataLoading,
  };
};

export { useHome };