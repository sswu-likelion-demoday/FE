import { Route } from "react-router-dom";

import Matchinghome from "../pages/Matching/Matching-home/Matchinghome";
import MatchingRequest from "../pages/Matching/Matching-request/MatchingRequest";
import MatchingProfile from "../pages/Matching/Matching-profile/MatchingProfile";

const MatchingRoutes = (
  <>
    <Route path="/matching" element={<Matchinghome />} />
    <Route path="/matching_home" element={<Matchinghome />} />
    <Route path="/matching/request" element={<MatchingRequest />} />
    <Route path="/matching/request/profile" element={<MatchingProfile />} />
  </>
);

export default MatchingRoutes;
