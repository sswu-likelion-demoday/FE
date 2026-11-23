import { Route } from "react-router-dom";

import Matchinghome from "../pages/Matching/Matching-home/Matchinghome";
import MatchingRequest from "../pages/Matching/Matching-request/MatchingRequest";
import MatchingProfile from "../pages/Matching/Matching-profile/MatchingProfile";
import MatchingStart from "../pages/Matching/Matching-start/MatchingStart";
import MatchingFound from "../pages/Matching/Matching-found/MatchingFound";
import MatchingSaju from "../pages/Matching/Matching-saju/MatchingSaju";
import MatchingSajuResult from "../pages/Matching/Matching-saju-result/MatchingSajuResult";
import MatchingCategory from "../pages/Matching/Matching-category/MatchingCategory";
import MatchingCategoryForm from "../pages/Matching/Matching-category-form/MatchingCategoryForm";
import MatchingCategoryWaiting from "../pages/Matching/Matching-category-waiting/MatchingCategoryWaiting";
import MatchingCategoryFound from "../pages/Matching/Matching-category-found/MatchingCategoryFound";
import MatchingCategoryResult from "../pages/Matching/Matching-category-result/MatchingCategoryResult";

const MatchingRoutes = (
  <>
    <Route path="/matching" element={<Matchinghome />} />
    <Route path="/matching_home" element={<Matchinghome />} />
    <Route path="/matching/request" element={<MatchingRequest />} />
    <Route path="/matching/request/profile" element={<MatchingProfile />} />
    <Route path="/matching/start" element={<MatchingStart />} />
    <Route path="/matching/found" element={<MatchingFound />} />
    <Route path="/matching/saju" element={<MatchingSaju />} />
    <Route path="/matching/saju/result" element={<MatchingSajuResult />} />
    <Route path="/matching/category" element={<MatchingCategory />} />
    <Route path="/matching/category/form" element={<MatchingCategoryForm />} />
    <Route path="/matching/category/waiting" element={<MatchingCategoryWaiting />} />
    <Route path="/matching/category/found" element={<MatchingCategoryFound />} />
    <Route path="/matching/category/result" element={<MatchingCategoryResult />} />
  </>
);

export default MatchingRoutes;
