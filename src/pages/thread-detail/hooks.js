import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useContentEditable } from '@hooks';
import {
  upVoteThreadDetail, downVoteThreadDetail,
  neutralVoteThreadDetail, upVoteComment,
  downVoteComment, neutralVoteComment,
  createComment, fetchThread
} from '@states/thunks/thread_detail';
import { showAuthRequiredToast, showToastSuccess, showToastError, abortPrevRequest } from '@utils';


const useThreadDetail = () => {
  const { threadId } = useParams();
  const controllers = useRef({});
  const dispatch = useDispatch();
  const [fetchDataError, setFetchDataError] = useState(null);
  const [fetchDataLoading, setFetchDataLoading] = useState(true);
  const [createCommentLoading, setCreateCommentLoading] = useState(false);
  const [commentContent, setCommentContent, onInputComment] = useContentEditable('');
  const thread = useSelector(({ threadDetail }) => threadDetail.data);
  const authUser = useSelector(({ auth }) => auth.user);

  const handleVote = (args) => {
    const {
      key,
      isUpvote,
      isNeutral,
      actionUp,
      actionDown,
      actionNeutral
    } = args;

    const controller = abortPrevRequest(key, controllers);
    controllers.current[key] = controller;

    const action = isNeutral ? actionNeutral : (isUpvote ? actionUp : actionDown);
    return (payload) =>
      dispatch(action({ ...payload, signal: controller.signal }))
        .unwrap()
        .catch((error) => showToastError(`vote-${key.split('-')[0]}-error`, error.message));
  };

  const handleVoteThread = (type) => {
    if (!authUser) return showAuthRequiredToast('thread vote');
    const isUpvote = type === 'up';
    const isNeutral = isUpvote
      ? thread.upVotesBy.includes(authUser?.id)
      : thread.downVotesBy.includes(authUser?.id);

    const payload = {
      threadId: thread.id,
    };
    handleVote({
      key: thread.id,
      isUpvote,
      isNeutral,
      actionUp: upVoteThreadDetail,
      actionDown: downVoteThreadDetail,
      actionNeutral: neutralVoteThreadDetail
    })(payload);
  };

  const handleVoteComment = (comment, type) => {
    if (!authUser) return showAuthRequiredToast('vote comment');
    const isUpvote = type === 'up';
    const isNeutral = isUpvote
      ? comment.upVotesBy.includes(authUser?.id)
      : comment.downVotesBy.includes(authUser?.id);
    const payload = {
      commentId: comment.id,
      threadId: thread.id,
    };
    handleVote({
      key: `${comment.id}`,
      isUpvote,
      isNeutral,
      actionUp: upVoteComment,
      actionDown: downVoteComment,
      actionNeutral: neutralVoteComment
    })(payload);
  };

  const handleCreateComment = () => {
    const controller = abortPrevRequest(`create-comment-${threadId}`);
    controllers.current[`create-comment-${threadId}`] = controller;

    setCreateCommentLoading(true);
    const payloads = {
      payload: { content: commentContent, threadId },
      signal: controller.signal,
    };
    dispatch(createComment(payloads))
      .unwrap()
      .then((res) => {
        setCommentContent('');
        const toastMessage = `${res.message} successfully`;
        showToastSuccess('create-comment-success', toastMessage);
      })
      .catch((error) => {
        showToastError('create-comment-error', error.message);
      })
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
    thread,
    createCommentLoading,
    authUser,
    fetchDataError,
    fetchDataLoading,
    handleUpVoteThread: () => handleVoteThread('up'),
    handleDownVoteThread: () => handleVoteThread('down'),
    handleUpVoteComment: (comment) => handleVoteComment(comment, 'up'),
    handleDownVoteComment: (comment) => handleVoteComment(comment, 'down'),
    handleCreateComment,
    commentContent,
    onInputComment,
  };
};

export { useThreadDetail };