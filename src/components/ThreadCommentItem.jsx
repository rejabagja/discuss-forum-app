import { timeAgo, parseHtmlString } from '@utils/index';
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { TypeThreadCommentItem } from './types/thread.type';

const ThreadCommentItem = ({
  comment,
  handleUpVote,
  handleDownVote,
  authUser,
}) => {
  const isLiked = comment.upVotesBy.includes(authUser?.id);
  const isDisliked = comment.downVotesBy.includes(authUser?.id);
  return (
    <div className="comment-item flex flex-col gap-3 p-3 border-b-[1px] border-b-slate-300 rounded-md">
      <header className="comment-item__header flex items-center">
        <div className="comment-item__owner-info flex gap-2 items-center flex-1 flex-shrink">
          <img
            src={comment.owner.avatar}
            alt={comment.owner.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-medium">{comment.owner.name}</span>
        </div>
        <span className="posted-at italic text-sm">
          {timeAgo(comment.createdAt)}
        </span>
      </header>
      <div className="comment-item__body">
        {parseHtmlString(comment.content)}
      </div>
      <footer className="comment-item__footer flex gap-3">
        <button
          className="flex flex-row gap-1 items-center text-sm"
          onClick={() => handleUpVote(comment)}
        >
          {isLiked ? (
            <BiSolidLike className="w-4 h-4" />
          ) : (
            <BiLike className="w-4 h-4" />
          )}
          <span className="text-success font-medium">
            {comment.upVotesBy.length}
          </span>
        </button>
        <button
          className="flex flex-row gap-1 items-center"
          onClick={() => handleDownVote(comment)}
        >
          {isDisliked ? (
            <BiSolidDislike className="w-4 h-4" />
          ) : (
            <BiDislike className="w-4 h-4" />
          )}
          <span className="text-error font-medium">
            {comment.downVotesBy.length}
          </span>
        </button>
      </footer>
    </div>
  );
};

ThreadCommentItem.propTypes = TypeThreadCommentItem;

export default ThreadCommentItem;
