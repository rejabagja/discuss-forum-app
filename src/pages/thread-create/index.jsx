import { useThreadCreate } from './hooks';
import FormThreadCreate from '@components/FormThreadCreate';
import { Navigate } from 'react-router-dom';

const PageThreadCreate = () => {
  const {
    title,
    onChangeTitle,
    body,
    onInputBody,
    category,
    onChangeCategory,
    handleCreateThread,
    error,
    loading,
    isCreateSucceded,
  } = useThreadCreate();

  if (isCreateSucceded) return <Navigate to="/" />;

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
          error={error}
          isLoading={loading}
        />
      </div>
    </section>
  );
};

export default PageThreadCreate;
