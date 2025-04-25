import { useThreadDetail } from './hooks';
import ThreadCommentInput from '@components/ThreadCommentInput';
import ThreadCommentList from '@components/ThreadCommentList';
import ThreadDetailContent from '@components/ThreadDetailContent';

const PageThreadDetail = () => {
  const {
    thread,
    error,
    isLoading,
    authUser,
    handleCreateComment,
    handleUpVoteThread,
    handleDownVoteThread,
    handleUpVoteComment,
    handleDownVoteComment,
    commentContent,
    onInputComment,
    ErrorType,
  } = useThreadDetail();

  if (error && error.type === ErrorType.NOT_FOUND)
    return (
      <div className="h-[500px] flex items-center justify-center flex-col">
        <h3>404</h3>
        <p>
          {error.message === 'thread tidak ditemukan'
            ? 'Thread not found'
            : error.message}
        </p>
      </div>
    );
  if (!thread) return null;
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
          isLoading={isLoading}
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
