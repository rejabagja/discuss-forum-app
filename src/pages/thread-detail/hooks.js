import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useContentEditable } from '@hooks';
import {
  upVoteThread, downVoteThread,
  neutralVoteThread, upVoteComment,
  downVoteComment, neutralVoteComment,
  createComment, fetchThread
} from '@states/thunks/thread_detail';
import { showAuthRequiredToast } from '@utils';


const useThreadDetail = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const [fetchDataError, setFetchDataError] = useState(null);
  const [fetchDataLoading, setFetchDataLoading] = useState(true);
  const [commentContent, setCommentContent, onInputComment] = useContentEditable('');
  const { data: thread, isLoading: createCommentLoading } = useSelector(({ threadDetail }) => threadDetail);
  const authUser = useSelector(({ authUser }) => authUser.data);

  const handleUpVoteThread = () => {
    if (!authUser) return showAuthRequiredToast('thread');
    dispatch(
      thread.upVotesBy.includes(authUser.id)
        ? neutralVoteThread(threadId)
        : upVoteThread(threadId)
    );
  };
  const handleDownVoteThread = () => {
    if (!authUser) return showAuthRequiredToast('thread');
    dispatch(
      thread.downVotesBy.includes(authUser.id)
        ? neutralVoteThread(threadId)
        : downVoteThread(threadId)
    );
  };
  const handleUpVoteComment = (comment) => {
    if (!authUser) return showAuthRequiredToast('comment');
    dispatch(
      comment.upVotesBy.includes(authUser.id)
        ? neutralVoteComment(comment.id)
        : upVoteComment(comment.id)
    );
  };
  const handleDownVoteComment = (comment) => {
    if (!authUser) return showAuthRequiredToast('comment');
    dispatch(
      comment.downVotesBy.includes(authUser.id)
        ? neutralVoteComment(comment.id)
        : downVoteComment(comment.id)
    );
  };
  const handleCreateComment = () => {
    dispatch(createComment({ content: commentContent, threadId }));
    setCommentContent('');
  };

  useEffect(() => {
    document.title = thread ? `${thread.title} - Discuss Forum App` : 'Discuss Forum App';
    return () => document.title = 'Discuss Forum App';
  }, [thread]);

  useEffect(() => {
    let isMounted = true;
    const promise = dispatch(fetchThread({ threadId }));

    promise
      .unwrap()
      .catch((error) => {
        if (isMounted && error.name !== 'AbortError') {
          setFetchDataError(error);
        }
      })
      .finally(() => {
        if (isMounted) {
          setFetchDataLoading(false);
        }
      });

    return () => {
      promise?.abort();
      isMounted = false;
    };
  }, [dispatch, threadId]);

  return {
    thread, createCommentLoading,
    authUser, fetchDataError, fetchDataLoading,
    handleUpVoteThread, handleDownVoteThread,
    handleUpVoteComment, handleDownVoteComment,
    handleCreateComment, commentContent, onInputComment,
  };
};

export { useThreadDetail };