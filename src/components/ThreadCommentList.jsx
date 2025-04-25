import ThreadCommentItem from './ThreadCommentItem';
import { TypeThreadCommentList } from './types/thread.type';

const ThreadCommentList = ({
  thread,
  handleUpVote,
  handleDownVote,
  authUser,
}) => {
  return (
    <div className="thread-comment__list">
      <h3 className="font-medium text-lg mb-1">
        Comments ({thread?.comments.length})
      </h3>
      <div className="comment_list mb-3 flex flex-col gap-2">
        {thread?.comments.map((comment) => (
          <ThreadCommentItem
            key={comment.id}
            comment={comment}
            handleUpVote={handleUpVote}
            handleDownVote={handleDownVote}
            authUser={authUser}
          />
        ))}
      </div>
    </div>
  );
};

ThreadCommentList.propTypes = TypeThreadCommentList;

export default ThreadCommentList;
