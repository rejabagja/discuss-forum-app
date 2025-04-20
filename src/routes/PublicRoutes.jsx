import { Route } from 'react-router-dom';
import PageHome from '@pages/home';
import PageLeaderboards from '@pages/leaderboards';
import PageThreadDetail from '@pages/thread-detail';

const PublicRoutes = (
  <>
    <Route path="/" element={<PageHome />} />
    <Route path="/threads/:threadId" element={<PageThreadDetail />} />
    <Route path="/leaderboards" element={<PageLeaderboards />} />
  </>
);

export default PublicRoutes;
