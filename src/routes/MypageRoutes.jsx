import { Route } from "react-router-dom";

import Mypage from "../pages/Mypage/Mypage";
import EditProfile from "../pages/Mypage/pages/EditProfile/EditProfile";
import ItemHistory from "../pages/Mypage/pages/ItemHistory/ItemHistory";
import MatchingInfo from "../pages/Mypage/pages/MatchingInfo/MatchingInfo";
import InterestCategory from "../pages/Mypage/pages/MatchingInfo/InterestCategory";
import BlockList from "../pages/Mypage/pages/BlockList/BlockList";
import Notice from "../pages/Mypage/pages/Notice/Notice";
import Withdraw from "../pages/Mypage/pages/Withdraw/Withdraw";

const MypageRoutes = (
  <>
    <Route path="/mypage" element={<Mypage />} />
    <Route path="/mypage/edit-profile" element={<EditProfile />} />
    <Route path="/mypage/item-history" element={<ItemHistory />} />
    <Route path="/mypage/matching-info" element={<MatchingInfo />} />
    <Route path="/mypage/interest-category" element={<InterestCategory />} />
    <Route path="/mypage/block-list" element={<BlockList />} />
    <Route path="/mypage/notice" element={<Notice />} />
    <Route path="/mypage/withdraw" element={<Withdraw />} />
  </>
);
export default MypageRoutes;
