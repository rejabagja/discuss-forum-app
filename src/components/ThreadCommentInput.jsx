import EditableContent from './EditableContent';
import { Link } from 'react-router-dom';
import { TypeThreadCommentInput } from './types/thread.type';

const ThreadCommentInput = ({
  authUser,
  value,
  onInput,
  addCommentHandler,
  isLoading,
}) => {
  return (
    <div className="thread-comment__input mb-6">
      <h3 className="font-medium text-lg">Leave a Comment</h3>
      {authUser ? (
        <form method="post">
          <EditableContent
            placeholder="Write your comment here..."
            className="my-3 max-h-28 overflow-y-auto"
            value={value}
            onInput={onInput}
          />
          <button
            className="btn btn-accent px-2 py-1 text-base w-full"
            onClick={addCommentHandler}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      ) : (
        <p className="text-sm mt-1">
          {'you need to '}
          <Link to="/login" className="link text-secondary">
            login
          </Link>
          {', to continue.'}
        </p>
      )}
    </div>
  );
};

ThreadCommentInput.propTypes = TypeThreadCommentInput;

export default ThreadCommentInput;
