import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUsers } from '@states/users';
import { setSelectedCategory } from '@states/categories';
import { useThreads } from '@hooks/index';


const usePageHome = () => {
  const { threads, handleUpVote, handleDownVote } = useThreads();
  const dispatch = useDispatch();
  const { users, categories, authUser } = useSelector(
    ({ users, categories, authUser }) => ({
      users,
      categories,
      authUser: authUser.data,
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

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);


  return { authUser, threadList, categories, handleUpVote, handleDownVote, toggleSelectedCategory };
};

export { usePageHome };