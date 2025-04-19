import ThreadItem from './ThreadItem';
import { TypeThreadList } from '@components/types/thread.type';

const ThreadList = ({ threads, handleUpVote, handleDownVote }) => {
  return (
    <div className="thread-list flex flex-col gap-2">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          upVote={handleUpVote}
          downVote={handleDownVote}
        />
      ))}
    </div>
  );
};

ThreadList.propTypes = TypeThreadList;

export default ThreadList;
