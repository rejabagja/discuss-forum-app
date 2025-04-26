import { useThreadCreate } from './hooks';
import FormThreadCreate from '@components/FormThreadCreate';
import FetchDataError from '@components/FetchDataError';

const PageThreadCreate = () => {
  const {
    title,
    onChangeTitle,
    body,
    onInputBody,
    category,
    onChangeCategory,
    handleCreateThread,
    threadCreateError,
    fetchDataError,
    fetchDataLoading,
    createLoading,
    ErrorType,
  } = useThreadCreate();

  if (fetchDataError?.type === ErrorType.FETCH_DATA)
    return <FetchDataError error={fetchDataError} />;
  if (fetchDataLoading) return null;
  return (
    <section className="thread-create-page">
      <h2 className="font-semibold text-xl mb-2 text-center">
        Create New Thread
      </h2>
      <div className="thread-create-page__content px-2 w-full max-w-2xl mx-auto">
        <FormThreadCreate
          title={title}
          onChangeTitle={onChangeTitle}
          body={body}
          onInputBody={onInputBody}
          category={category}
          onChangeCategory={onChangeCategory}
          handleCreateThread={handleCreateThread}
          error={
            threadCreateError?.type === ErrorType.CREATE_THREAD
              ? threadCreateError.message
              : null
          }
          isLoading={createLoading}
        />
      </div>
    </section>
  );
};

export default PageThreadCreate;
