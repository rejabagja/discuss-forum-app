import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThread } from '@states/thread-detail';
import { useContentEditable, useFetchData } from '@hooks';
import {
  upVoteThread, downVoteThread,
  neutralVoteThread, upVoteComment,
  downVoteComment, neutralVoteComment,
  createComment
} from '@states/thread-detail';
import { useEffect } from 'react';
import { ErrorType } from '@constants';


const useThreadDetail = () => {
  const { threadId } = useParams();
  const { isLoading: fetchDataLoading, error: fetchDataError } = useFetchData([() => fetchThread(threadId)]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [commentContent, setCommentContent, onInputComment] = useContentEditable('');
  const { data: thread, isLoading: createCommentLoading } = useSelector(({ threadDetail }) => threadDetail);
  const authUser = useSelector(({ authUser }) => authUser.data);

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
    document.title = 'Thread Detail - Discuss Forum App';
    return () => document.title = 'Discuss Forum App';
  }, [dispatch]);

  return {
    thread, createCommentLoading,
    authUser, fetchDataError, fetchDataLoading,
    handleUpVoteThread, handleDownVoteThread,
    handleUpVoteComment, handleDownVoteComment,
    handleCreateComment, commentContent, onInputComment, ErrorType
  };
};

export { useThreadDetail };