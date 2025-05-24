import { Route } from 'react-router-dom';
import { PageHome, PageLeaderboards, PageThreadDetail } from '@pages';

const PublicRoutes = (
  <>
    <Route path="/" element={<PageHome />} />
    <Route path="/threads/:threadId" element={<PageThreadDetail />} />
    <Route path="/leaderboards" element={<PageLeaderboards />} />
  </>
);

export default PublicRoutes;
