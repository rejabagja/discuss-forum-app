import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '@states/slices/categories';
import {
  fetchThreads,
  upVoteThreads,
  downVoteThreads,
  neutralVoteThreads,
} from '@states/thunks/threads';
import { fetchUsers } from '@states/thunks/users';
import { useFetchData } from '@hooks';
import { showAuthRequiredToast } from '@utils';


const useHome = () => {
  const { error: fetchDataError, isLoading: fetchDataLoading } = useFetchData([fetchUsers, fetchThreads]);
  const dispatch = useDispatch();
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
    if (category === selectedCategory) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(category));
    }
  };

  const handleUpVote = (thread) => {
    if (!authUser) return showAuthRequiredToast('thread');
    if (thread.upVotesBy.includes(authUser.id)) {
      dispatch(
        neutralVoteThreads(thread.id)
      );
    } else {
      dispatch(
        upVoteThreads(thread.id)
      );
    }
  };

  const handleDownVote = (thread) => {
    if (!authUser) return showAuthRequiredToast('thread');
    if (thread.downVotesBy.includes(authUser.id)) {
      dispatch(
        neutralVoteThreads(thread.id)
      );
    } else {
      dispatch(
        downVoteThreads(thread.id)
      );
    }
  };

  return {
    authUser, threadList,
    categories, selectedCategory,
    handleUpVote, handleDownVote,
    toggleSelectedCategory, fetchDataError, fetchDataLoading,
  };
};

export { useHome };