import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedCategory } from '@states/categories';
import {
  upVoteThreads,
  downVoteThreads,
  neutralVoteThreads,
} from '@states/threads';
import { useFetchData } from '@hooks';
import { fetchUsers } from '@states/users';
import { fetchThreads } from '@states/threads';
import { ErrorType } from '@constants';


const useHome = () => {
  const { error: fetchDataError, isLoading: fetchDataLoading } = useFetchData([fetchUsers, fetchThreads]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if (!authUser) return navigate('/login');
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
    if (!authUser) return navigate('/login');
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
    toggleSelectedCategory, fetchDataError, fetchDataLoading, ErrorType
  };
};

export { useHome };