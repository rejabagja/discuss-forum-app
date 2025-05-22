import { useEffect, useRef, useState } from 'react';
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
  const [createCommentLoading, setCreateCommentLoading] = useState(false);
  const [commentContent, setCommentContent, onInputComment] = useContentEditable('');
  const thread = useSelector(({ threadDetail }) => threadDetail.data);
  const authUser = useSelector(({ auth }) => auth.user);
  const controllers = useRef({});


  const handleVoteThread = (type) => {
    if (!authUser) return showAuthRequiredToast('thread');

    if (controllers.current[`vote-thread-${threadId}`] && !controllers.current[`vote-thread-${threadId}`].signal.aborted) {
      controllers.current[`vote-thread-${threadId}`].abort();
    }

    const controller = new AbortController();
    controllers.current[`vote-thread-${threadId}`] = controller;

    const payloads = {
      threadId,
      signal: controller.signal,
    };

    if (type === 'up') {
      dispatch(
        thread.upVotesBy.includes(authUser.id)
          ? neutralVoteThread(payloads)
          : upVoteThread(payloads)
      );
    } else if (type === 'down') {
      dispatch(
        thread.downVotesBy.includes(authUser.id)
          ? neutralVoteThread(payloads)
          : downVoteThread(payloads)
      );
    }
  };

  const handleVoteComment = (comment, type) => {
    if (!authUser) return showAuthRequiredToast('thread');

    if (
      controllers.current[`vote-comment-${comment.id}`] &&
      !controllers.current[`vote-comment-${comment.id}`].signal.aborted
    ) {
      controllers.current[`vote-comment-${comment.id}`].abort();
    }

    const controller = new AbortController();
    controllers.current[`vote-comment-${comment.id}`] = controller;

    const payloads = {
      commentId: comment.id,
      signal: controller.signal,
    };

    if (type === 'up') {
      dispatch(
        comment.upVotesBy.includes(authUser.id)
          ? neutralVoteComment(payloads)
          : upVoteComment(payloads)
      );
    } else if (type === 'down') {
      dispatch(
        comment.downVotesBy.includes(authUser.id)
          ? neutralVoteComment(payloads)
          : downVoteComment(payloads)
      );
    }
  };

  const handleUpVoteThread = () => handleVoteThread('up');
  const handleDownVoteThread = () => handleVoteThread('down');

  const handleUpVoteComment = (comment) => handleVoteComment(comment, 'up');
  const handleDownVoteComment = (comment) => handleVoteComment(comment, 'down');

  const handleCreateComment = () => {
    if (controllers.current[`create-${threadId}`] && !controllers.current[`create-${threadId}`].signal.aborted) {
      controllers.current[`create-${threadId}`].abort();
    }
    const controller = new AbortController();
    controllers.current[`create-${threadId}`] = controller;

    setCreateCommentLoading(true);
    const payloads = {
      payload: { content: commentContent, threadId },
      signal: controller.signal,
    };
    dispatch(createComment(payloads))
      .unwrap()
      .then(() => {
        setCommentContent('');
      })
      .catch(() => {})
      .finally(() => setCreateCommentLoading(false));
  };

  useEffect(() => {
    document.title = thread ? `${thread.title} - Discuss Forum App` : 'Discuss Forum App';
    return () => document.title = 'Discuss Forum App';
  }, [thread]);

  useEffect(() => {
    let isMounted = true;
    const controllerList = controllers.current;
    Object.values(controllerList).forEach((controller) => controller?.abort());

    const fetchThreadController = new AbortController();
    dispatch(fetchThread({ threadId, signal: fetchThreadController.signal }))
      .unwrap()
      .catch((error) => {
        if (isMounted) {
          setFetchDataError(error);
        }
      })
      .finally(() => {
        if (isMounted) {
          setFetchDataLoading(false);
        }
      });

    return () => {
      fetchThreadController?.abort();
      Object.values(controllerList).forEach((controller) => controller?.abort());
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