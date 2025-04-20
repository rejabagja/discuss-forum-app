import { Link } from 'react-router-dom';
import { timeAgo, parseHtmlStringWithTrim } from '@utils/index';
import {
  BiLike,
  BiDislike,
  BiReply,
  BiSolidLike,
  BiSolidDislike,
} from 'react-icons/bi';
import { TypeThreadItem } from './types/thread.type';

const ThreadItem = ({ thread, upVote, downVote }) => {
  const isLiked = thread.upVotesBy.includes(thread.authUser?.id);
  const isDisliked = thread.downVotesBy.includes(thread.authUser?.id);
  if (!thread.owner) return null;
  return (
    <article className="thread-item flex flex-col gap-1 border-b-2 px-3 py-2 border-b-slate-200 rounded-md">
      <header className="thread-item__header">
        <span className="thread-item__category text-xs py-1 px-2 outline outline-1 rounded-sm mb-2 inline-block">
          #{thread.category}
        </span>
        <h4 className="thread-item__title">
          <Link
            to={`/threads/${thread.id}`}
            className="font-medium text-lg text-primary hover:underline active:text-purple-600"
          >
            {thread.title}
          </Link>
        </h4>
      </header>
      <div className="thread-item__body text-sm mt-1">
        {parseHtmlStringWithTrim(thread.body, 238)}
      </div>
      <footer className="thread-item__footer flex justify-start items-center gap-4 py-3 text-sm">
        <button
          className="thread-item__upvote-button flex flex-row gap-1 items-center"
          title="like"
          onClick={() => upVote(thread)}
        >
          <span className="text-lg">
            {isLiked ? <BiSolidLike /> : <BiLike />}
          </span>
          <span className="text-success font-medium">
            {thread.upVotesBy.length}
          </span>
        </button>
        <button
          className="thread-item__downvote-button flex flex-row gap-1 items-center"
          title="dislike"
          onClick={() => downVote(thread)}
        >
          <span className="text-lg">
            {isDisliked ? <BiSolidDislike /> : <BiDislike />}
          </span>
          <span className="text-error font-medium">
            {thread.downVotesBy.length}
          </span>
        </button>
        <p
          className="thread-item__comment-totals flex flex-row gap-1 items-center"
          title="total comments"
        >
          <BiReply className="text-lg" />
          {thread.totalComments}
        </p>
        <p
          className="italic flex flex-row gap-1 items-center"
          title="created at"
        >
          {timeAgo(thread.createdAt)}
        </p>
        <p className="thread-item__owner">
          created by <span className="font-medium">{thread.owner?.name}</span>
        </p>
      </footer>
    </article>
  );
};

ThreadItem.propTypes = TypeThreadItem;

export default ThreadItem;
