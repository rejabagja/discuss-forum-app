import { Route } from 'react-router-dom';
import PageHome from '@pages/home';
import PageThreadDetail from '@pages/thread-detail';

const PublicRoutes = (
  <>
    <Route path="/" element={<PageHome />} />
    <Route path="/threads/:threadId" element={<PageThreadDetail />} />
    <Route
      path="/leaderboards"
      element={
        <p className="font-semibold text-xl mb-1">Active Users Leaderboard</p>
      }
    />
  </>
);

export default PublicRoutes;
