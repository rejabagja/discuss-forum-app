import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '@states/slices/categories';
import {
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
} from '@states/thunks/threads';
import { showAuthRequiredToast, showToastError, abortPrevRequest } from '@utils';
import { useEffect, useRef, useState } from 'react';
import { fetchUsersThreads } from '@states/thunks';


const useHome = () => {
  const dispatch = useDispatch();
  const controllers = useRef({});
  const [fetchDataError, setFetchDataError] = useState(null);
  const [fetchDataLoading, setFetchDataLoading] = useState(true);
  const users = useSelector(({ users }) => users.data);
  const threads = useSelector(({ threads }) => threads.data);
  const authUser = useSelector(({ auth }) => auth.user);
  const isAuthed = Boolean(authUser);
  const { data: categories, selectedCategory } = useSelector(({ categories }) => categories);

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

  const handleVote = (args) => {
    const {
      key,
      isUpvote,
      isNeutral,
      actionUp,
      actionDown,
      actionNeutral
    } = args;

    const controller = abortPrevRequest(`vote-${key}`, controllers);
    controllers.current[`vote-${key}`] = controller;

    const action = isNeutral ? actionNeutral : isUpvote ? actionUp : actionDown;
    return (payload) =>
      dispatch(action({ ...payload, signal: controller.signal }))
        .unwrap()
        .catch((error) => {
          if (error.name === 'AbortError') return;
          showToastError(`vote-${key.split('-')[0]}-error`, error.message);
        });
  };

  const handleVoteThread = (thread, type) => {
    if (!authUser) return showAuthRequiredToast('thread vote');
    const threadId = thread.id;
    const isUpvote = type === 'up';
    const isNeutral = isUpvote
      ? thread.upVotesBy.includes(authUser.id)
      : thread.downVotesBy.includes(authUser.id);

    const payload = { threadId };
    handleVote({
      key: threadId,
      isUpvote,
      isNeutral,
      actionUp: upVoteThread,
      actionDown: downVoteThread,
      actionNeutral: neutralVoteThread
    })(payload);
  };

  useEffect(() => {
    let isMounted = true;
    const controllerList = controllers.current;
    Object.values(controllerList).forEach((controller) =>
      controller.abort()
    );

    const fetchUsersThreadsController = new AbortController();
    dispatch(fetchUsersThreads({ signal: fetchUsersThreadsController.signal }))
      .unwrap()
      .catch((error) => {
        if (isMounted) {
          setFetchDataError(error);
        }
      })
      .finally(() => {
        if (isMounted) setFetchDataLoading(false);
      });

    return () => {
      fetchUsersThreadsController.abort?.();
      Object.values(controllerList).forEach((controller) => controller?.abort());
      isMounted = false;
    };
  }, [dispatch]);

  return {
    isAuthed,
    filteredThreads,
    categories,
    selectedCategory,
    handleUpVoteThread: (thread) => handleVoteThread(thread, 'up'),
    handleDownVoteThread: (thread) => handleVoteThread(thread, 'down'),
    toggleSelectedCategory,
    fetchDataError,
    fetchDataLoading,
  };
};

export { useHome };