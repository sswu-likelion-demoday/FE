import { Route } from "react-router-dom";

import Mypage from "../pages/Mypage/Mypage";
import EditProfile from "../pages/Mypage/pages/EditProfile/EditProfile";
import ItemHistory from "../pages/Mypage/pages/ItemHistory/ItemHistory";
import MatchingInfo from "../pages/Mypage/pages/MatchingInfo/MatchingInfo";
import InterestCategory from "../pages/Mypage/pages/MatchingInfo/InterestCategory";
import BlockList from "../pages/Mypage/pages/BlockList/BlockList";

const MypageRoutes = (
  <>
    <Route path="/mypage" element={<Mypage />} />
    <Route path="/mypage/edit-profile" element={<EditProfile />} />
    <Route path="/mypage/item-history" element={<ItemHistory />} />
    <Route path="/mypage/matching-info" element={<MatchingInfo />} />
    <Route path="/mypage/interest-category" element={<InterestCategory />} />
    <Route path="/mypage/block-list" element={<BlockList />} />
  </>
);
export default MypageRoutes;
