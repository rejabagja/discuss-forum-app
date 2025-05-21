import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '@states/slices/categories';
import {
  upVoteThreads,
  downVoteThreads,
  neutralVoteThreads,
} from '@states/thunks/threads';
import { showAuthRequiredToast } from '@utils';
import { useEffect, useRef, useState } from 'react';
import { fetchUsersThreads } from '@states/thunks';


const useHome = () => {
  const dispatch = useDispatch();
  const [fetchDataError, setFetchDataError] = useState(null);
  const [fetchDataLoading, setFetchDataLoading] = useState(true);
  const users = useSelector(({ users }) => users.data);
  const threads = useSelector(({ threads }) => threads.data);
  const authUser = useSelector(({ authUser }) => authUser.data);
  const isAuthed = Boolean(authUser);
  const { data: categories, selectedCategory } = useSelector(({ categories }) => categories);
  const controllers = useRef({});

  const threadsOwnerAuth = threads.map((thread) => ({
    ...thread,
    owner: users.find((user) => user.id === thread.ownerId),
    authUser,
  }));

  const filteredThreads = threadsOwnerAuth.filter((thread) => {
    if (!selectedCategory) return true;
    return thread.category === selectedCategory;
  });

  const toggleSelectedCategory = (category) => {
    dispatch(
      category === selectedCategory
        ? setSelectedCategory(null)
        : setSelectedCategory(category)
    );
  };

  const handleVote = (thread, type) => {
    if (!isAuthed) return showAuthRequiredToast('thread');

    const threadId = thread.id;

    if (controllers.current[threadId]) {
      controllers.current[threadId].abort();
    }

    const controller = new AbortController();
    controllers.current[threadId] = controller;

    delete thread.owner;
    delete thread.authUser;

    const payloads = {
      thread,
      signal: controller.signal,
    };

    if (type === 'up') {
      dispatch(
        thread.upVotesBy.includes(authUser.id)
          ? neutralVoteThreads(payloads)
          : upVoteThreads(payloads)
      );
    } else if (type === 'down') {
      dispatch(
        thread.downVotesBy.includes(authUser.id)
          ? neutralVoteThreads(payloads)
          : downVoteThreads(payloads)
      );
    }
  };

  const handleUpVote = (thread) => handleVote(thread, 'up');
  const handleDownVote = (thread) => handleVote(thread, 'down');

  useEffect(() => {
    let isMounted = true;
    Object.values(controllers.current).forEach((controller) =>
      controller.abort()
    );
    controllers.current = {};

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
      promise.abort?.();
      Object.values(controllers.current).forEach((controller) => controller.abort());
      isMounted = false;
    };
  }, [dispatch]);

  return {
    isAuthed, filteredThreads,
    categories, selectedCategory,
    handleUpVote, handleDownVote,
    toggleSelectedCategory, fetchDataError, fetchDataLoading,
  };
};

export { useHome };