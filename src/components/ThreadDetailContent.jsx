import { parseHtmlString, formatTimeAgo } from '@utils/index';
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { TypeThreadDetailContent } from './types/thread.type';

const ThreadDetailContent = ({
  thread,
  authUser,
  handleUpVote,
  handleDownVote,
}) => {
  const isLiked = thread?.upVotesBy.includes(authUser?.id);
  const isDisliked = thread?.downVotesBy.includes(authUser?.id);
  return (
    <>
      <header className="thread-header">
        <span className="px-2 py-1 mb-3 inline-block outline outline-1 rounded-sm shadow-md text-xs">
          #{thread?.category}
        </span>
      </header>
      <div className="thread-content mb-4">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-primary">
          {thread?.title}
        </h2>
        <div className="thread-content__body text-base mt-4">
          {parseHtmlString(thread?.body)}
        </div>
      </div>
      <footer className="thread-footer flex gap-3 text-sm">
        <button
          className="thread-item__upvote-button flex flex-row gap-1 items-center"
          title="upvote"
          onClick={() => handleUpVote()}
        >
          {isLiked ? (
            <BiSolidLike className="w-4 h-4" />
          ) : (
            <BiLike className="w-4 h-4" />
          )}
          <span className="text-success font-medium">
            {thread?.upVotesBy.length}
          </span>
        </button>
        <button
          className="thread-item__downvote-button flex flex-row gap-1 items-center"
          title="downvote"
          onClick={() => handleDownVote()}
        >
          {isDisliked ? (
            <BiSolidDislike className="w-4 h-4" />
          ) : (
            <BiDislike className="w-4 h-4" />
          )}
          <span className="text-error font-medium">
            {thread?.downVotesBy.length}
          </span>
        </button>
        <div className="thread-item__owner flex gap-1 items-center">
          <span className="mr-1">Created by </span>
          <img
            src={thread?.owner.avatar}
            alt={thread?.owner.name}
            className="w-5 h-5 rounded-full"
          />
          <span className="font-medium">{thread?.owner.name}</span>
        </div>
        <p className="italic" title="created at">
          {formatTimeAgo(thread?.createdAt)}
        </p>
      </footer>
    </>
  );
};

ThreadDetailContent.propTypes = TypeThreadDetailContent;

export default ThreadDetailContent;
