import { Route } from "react-router-dom";

import Mypage from "../pages/Mypage/Mypage";
import EditProfile from "../pages/Mypage/pages/EditProfile/EditProfile";
import ItemHistory from "../pages/Mypage/pages/ItemHistory/ItemHistory";
import MatchingInfo from "../pages/Mypage/pages/MatchingInfo/MatchingInfo";

const OnboardingRoutes = (
  <>
    <Route path="/mypage" element={<Mypage />} />
    <Route path="/mypage/edit-profile" element={<EditProfile />} />
    <Route path="/mypage/item-history" element={<ItemHistory />} />
    <Route path="/mypage/matching-info" element={<MatchingInfo />} />
  </>
);
export default OnboardingRoutes;
