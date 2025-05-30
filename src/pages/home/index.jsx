import { useHome } from './hooks';
import {
  CategoryList,
  ThreadList,
  FetchDataError,
  CategoryItemSkeleteon,
  ThreadItemSkeleton,
} from '@components';
import { BiPlus } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const PageHome = () => {
  const {
    isAuthed,
    filteredThreads,
    categories,
    selectedCategory,
    handleDownVoteThread,
    handleUpVoteThread,
    toggleSelectedCategory,
    fetchDataError,
    fetchDataLoading,
  } = useHome();

  if (fetchDataError) return <FetchDataError error={fetchDataError} />;

  return (
    <section className="home-page">
      <header className="mb-6">
        <p className="mb-2 font-medium">Popular Category:</p>
        {fetchDataLoading && categories.length === 0 && (
          <CategoryItemSkeleteon />
        )}
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          filter={toggleSelectedCategory}
        />
      </header>

      <div className="home-page__content">
        <h2 className="font-semibold text-xl mb-2">Open Discussions</h2>
        {fetchDataLoading && filteredThreads.length === 0 && (
          <ThreadItemSkeleton />
        )}
        <ThreadList
          threads={filteredThreads}
          handleDownVote={handleDownVoteThread}
          handleUpVote={handleUpVoteThread}
        />
      </div>

      {isAuthed && (
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
