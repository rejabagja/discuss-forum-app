import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';;
import { useNavigate } from 'react-router-dom';
import { upVoteThreads, downVoteThreads, neutralVoteThreads, fetchThreads } from '@states/threads';


const useThreads = () => {
  const { threads, authUser } = useSelector(({ threads, authUser }) => ({ threads, authUser: authUser.data }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const handleUpVote = (thread) => {
    if (!authUser) return navigate('/login');
    if (thread.upVotesBy.includes(thread.authUser.id)) {
      dispatch(
        neutralVoteThreads({ threadId: thread.id, userId: thread.authUser.id })
      );
    } else {
      dispatch(
        upVoteThreads({ threadId: thread.id, userId: thread.authUser.id })
      );
    }
  };
  const handleDownVote = (thread) => {
    if (!authUser) return navigate('/login');
    if (thread.downVotesBy.includes(thread.authUser.id)) {
      dispatch(
        neutralVoteThreads({ threadId: thread.id, userId: thread.authUser.id })
      );
    } else {
      dispatch(
        downVoteThreads({ threadId: thread.id, userId: thread.authUser.id })
      );
    }
  };

  return { threads, handleUpVote, handleDownVote };
};

const useThreadDetail = () => {
  const { threadDetail, authUser } = useSelector(({ threadDetail, authUser }) => ({
    threadDetail,
    authUser: authUser.data,
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(receiveThreads());
  }, [dispatch]);

  return { threadDetail, authUser };
};

export { useThreads, useThreadDetail };