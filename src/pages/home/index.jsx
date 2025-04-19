import { usePageHome } from './hook';
import CategoryList from '@components/CategoryList';
import ThreadList from '@components/ThreadList';
import { BiPlus } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const PageHome = () => {
  const {
    authUser,
    threadList,
    categories,
    handleDownVote,
    handleUpVote,
    toggleSelectedCategory,
  } = usePageHome();

  const filteredThreadList = categories.selectedCategory
    ? threadList.filter((thread) => {
      return thread.category === categories.selectedCategory;
    })
    : threadList;

  return (
    <section className="home-page pb-20">
      <header className="mb-6">
        <p className="mb-2 font-medium">Popular Category:</p>
        <CategoryList categories={categories} filter={toggleSelectedCategory} />
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
          to="/threads/create"
        >
          <BiPlus />
        </Link>
      )}
    </section>
  );
};

export default PageHome;
