import { useThreadDetail } from './hooks';
import ThreadCommentInput from '@components/ThreadCommentInput';
import ThreadCommentList from '@components/ThreadCommentList';
import ThreadDetailContent from '@components/ThreadDetailContent';
import FetchDataError from '@components/FetchDataError';

const PageThreadDetail = () => {
  const {
    thread,
    fetchDataError,
    fetchDataLoading,
    createCommentLoading,
    authUser,
    handleCreateComment,
    handleUpVoteThread,
    handleDownVoteThread,
    handleUpVoteComment,
    handleDownVoteComment,
    commentContent,
    onInputComment,
  } = useThreadDetail();

  if (fetchDataError) return <FetchDataError error={fetchDataError} />;
  if (fetchDataLoading)
    return (
      <section className="detail-page-loader h-screen flex-1 flex flex-col justify-center">
        <span className="loading loading-bars loading-md lg:loading-lg mx-auto text-accent-darker"></span>
      </section>
    );
  return (
    <section className="detail-page">
      <ThreadDetailContent
        thread={thread}
        authUser={authUser}
        handleUpVote={handleUpVoteThread}
        handleDownVote={handleDownVoteThread}
      />
      <div className="thread-comment mt-6">
        <ThreadCommentInput
          authUser={authUser}
          value={commentContent}
          onInput={onInputComment}
          addCommentHandler={handleCreateComment}
          isLoading={createCommentLoading}
        />
        <ThreadCommentList
          thread={thread}
          handleUpVote={handleUpVoteComment}
          handleDownVote={handleDownVoteComment}
          authUser={authUser}
        />
      </div>
    </section>
  );
};

export default PageThreadDetail;
