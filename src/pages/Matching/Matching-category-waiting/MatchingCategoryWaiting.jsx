import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingCategoryWaiting.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategoryMatchingWaitingPage from "../components/CategoryMatchingWaitingPage";
import { categoryLabels } from "../data/categoryData";

const MatchingCategoryWaiting = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 신청한 카테고리 (없으면 밥약)
  const category = (location.state && location.state.category) || "MEAL";

  // 신청이 끝났으니 폼으로 돌아가지 않고 카테고리 선택으로 이동
  const goCategory = () => navigate("/matching/category");

  return (
    <div className="page MatchingCategoryWaiting_wrap">
      <MatchingHeader title={categoryLabels[category]} onBack={goCategory} />
      <CategoryMatchingWaitingPage onConfirm={goCategory} />
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingCategoryWaiting;
