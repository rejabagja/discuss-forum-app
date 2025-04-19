import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { receiveThreadDetail } from '@states/thread-detail';

const PageThreadDetail = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const { thread, error } = useSelector(({ threadDetail }) => threadDetail);

  useEffect(() => {
    if (!thread) {
      dispatch(receiveThreadDetail(threadId));
    }
  }, [threadId, dispatch, thread]);

  return <div>Page ThreadDetail: {threadId}</div>;
};

export default PageThreadDetail;
