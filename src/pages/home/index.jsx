import { useHome } from './hooks';
import CategoryList from '@components/CategoryList';
import ThreadList from '@components/ThreadList';
import { BiPlus } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import FetchDataError from '@components/FetchDataError';

const PageHome = () => {
  const {
    authUser,
    threadList,
    categories,
    selectedCategory,
    handleDownVote,
    handleUpVote,
    toggleSelectedCategory,
    fetchDataError,
    fetchDataLoading,
    ErrorType,
  } = useHome();

  const filteredThreadList = selectedCategory
    ? threadList.filter((thread) => thread.category === selectedCategory)
    : threadList;

  if (fetchDataError?.type === ErrorType.FETCH_DATA)
    return <FetchDataError error={fetchDataError} />;
  if (fetchDataLoading && threadList.length === 0) return null;

  return (
    <section className="home-page">
      <header className="mb-6">
        <p className="mb-2 font-medium">Popular Category:</p>
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          filter={toggleSelectedCategory}
        />
      </header>

      <div className="home-page__content">
        <h2 className="font-semibold text-xl mb-2">Open Discussions</h2>
        <ThreadList
          threads={filteredThreadList}
          handleDownVote={handleDownVote}
          handleUpVote={handleUpVote}
        />
      </div>

      {authUser && (
        <Link
          className="btn btn-circle btn-accent shadow-lg text-2xl fixed bottom-20 right-5"
          title="create new thread"
          to="/create"
        >
          <BiPlus />
        </Link>
      )}
    </section>
  );
};

export default PageHome;
