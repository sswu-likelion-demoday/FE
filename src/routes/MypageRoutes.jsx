import { Route } from "react-router-dom";

import Mypage from "../pages/Mypage/Mypage";

const OnboardingRoutes = (
  <>
    <Route path="/mypage" element={<Mypage />} />
  </>
);
export default OnboardingRoutes;
