import { Route } from "react-router-dom";

import Matchinghome from "../pages/Matching/Matching-home/Matchinghome";
import MatchingRequest from "../pages/Matching/Matching-request/MatchingRequest";
import MatchingProfile from "../pages/Matching/Matching-profile/MatchingProfile";
import MatchingStart from "../pages/Matching/Matching-start/MatchingStart";
import MatchingFound from "../pages/Matching/Matching-found/MatchingFound";
import MatchingSaju from "../pages/Matching/Matching-saju/MatchingSaju";

const MatchingRoutes = (
  <>
    <Route path="/matching" element={<Matchinghome />} />
    <Route path="/matching_home" element={<Matchinghome />} />
    <Route path="/matching/request" element={<MatchingRequest />} />
    <Route path="/matching/request/profile" element={<MatchingProfile />} />
    <Route path="/matching/start" element={<MatchingStart />} />
    <Route path="/matching/found" element={<MatchingFound />} />
    <Route path="/matching/saju" element={<MatchingSaju />} />
  </>
);

export default MatchingRoutes;
