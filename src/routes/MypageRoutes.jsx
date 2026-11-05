import { Route } from "react-router-dom";

import Mypage from "../pages/Mypage/Mypage";
import EditProfile from "../pages/Mypage/pages/EditProfile/EditProfile";
import ItemHistory from "../pages/Mypage/pages/ItemHistory/ItemHistory";

const OnboardingRoutes = (
  <>
    <Route path="/mypage" element={<Mypage />} />
    <Route path="/mypage/edit-profile" element={<EditProfile />} />
    <Route path="/mypage/item-history" element={<ItemHistory />} />
  </>
);
export default OnboardingRoutes;
