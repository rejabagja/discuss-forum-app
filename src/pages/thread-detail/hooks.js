import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreadDetailData } from '@states/thunks';
import { useContentEditable } from '@hooks/index';
import {
  upVoteThread, downVoteThread,
  neutralVoteThread, upVoteComment,
  downVoteComment, neutralVoteComment,
  createComment, ErrorType
} from '@states/thread-detail';


const useThreadDetail = () => {
  const { threadId } = useParams();
  const [commentContent, setCommentContent, onInputComment] = useContentEditable('');
  const { data: thread, error, isLoading } = useSelector(({ threadDetail }) => threadDetail);
  const authUser = useSelector(({ authUser }) => authUser.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpVoteThread = () => {
    if (!authUser) return navigate('/login');
    if (thread.upVotesBy.includes(authUser.id)) {
      dispatch(neutralVoteThread(threadId));
    } else {
      dispatch(upVoteThread(threadId));
    }
  };
  const handleDownVoteThread = () => {
    if (!authUser) return navigate('/login');
    if (thread.downVotesBy.includes(authUser.id)) {
      dispatch(neutralVoteThread(threadId));
    } else {
      dispatch(downVoteThread(threadId));
    }
  };
  const handleUpVoteComment = (comment) => {
    if (!authUser) return navigate('/login');
    if (comment.upVotesBy.includes(authUser.id)) {
      dispatch(neutralVoteComment(comment.id));
    } else {
      dispatch(upVoteComment(comment.id));
    }
  };
  const handleDownVoteComment = (comment) => {
    if (!authUser) return navigate('/login');
    if (comment.downVotesBy.includes(authUser.id)) {
      dispatch(neutralVoteComment(comment.id));
    } else {
      dispatch(downVoteComment(comment.id));
    }
  };
  const handleCreateComment = () => {
    dispatch(createComment({ content: commentContent, threadId }));
    setCommentContent('');
  };

  useEffect(() => {
    dispatch(fetchThreadDetailData(threadId));
  }, [threadId, dispatch]);

  return {
    thread, error, isLoading,
    ErrorType, authUser,
    handleUpVoteThread, handleDownVoteThread,
    handleUpVoteComment, handleDownVoteComment,
    handleCreateComment, commentContent, onInputComment
  };
};

export { useThreadDetail };