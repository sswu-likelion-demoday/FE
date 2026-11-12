import { Route } from "react-router-dom";

import Matchinghome from "../pages/Matching/Matching-home/Matchinghome";

const MatchingRoutes = (
  <>
    <Route path="/matching" element={<Matchinghome />} />
    <Route path="/matching_home" element={<Matchinghome />} />
  </>
);

export default MatchingRoutes;
