import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingCategoryFound.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategoryMatchFoundPage from "../components/CategoryMatchFoundPage";
import { categoryLabels } from "../data/categoryData";

const MatchingCategoryFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 매칭된 카테고리 (없으면 밥약)
  const category = (location.state && location.state.category) || "MEAL";

  return (
    <div className="page MatchingCategoryFound_wrap">
      <MatchingHeader title={categoryLabels[category]} />
      <CategoryMatchFoundPage
        onViewResults={() =>
          navigate("/matching/category/result", { state: { category } })
        }
      />
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingCategoryFound;
