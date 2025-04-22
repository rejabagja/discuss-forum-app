import { useThreadCreate } from './hooks';
import FormThreadCreate from '@components/FormThreadCreate';

const PageThreadCreate = () => {
  const {
    title,
    onChangeTitle,
    onInputBody,
    category,
    onChangeCategory,
    handleCreateThread,
    threadCreateError,
    isLoading,
  } = useThreadCreate();
  return (
    <section className="thread-create-page">
      <h2 className="font-semibold text-xl mb-2 text-center">
        Create New Thread
      </h2>
      <div className="thread-create-page__content px-2 w-full max-w-2xl mx-auto">
        <FormThreadCreate
          title={title}
          onChangeTitle={onChangeTitle}
          onInputBody={onInputBody}
          category={category}
          onChangeCategory={onChangeCategory}
          handleCreateThread={handleCreateThread}
          error={threadCreateError}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default PageThreadCreate;
