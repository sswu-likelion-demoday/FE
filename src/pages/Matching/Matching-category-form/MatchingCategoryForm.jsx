import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingCategoryForm.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategoryMatchingFormPage from "../components/CategoryMatchingFormPage";
import { categoryLabels } from "../data/categoryData";

const MatchingCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 선택한 카테고리 (없으면 밥약)
  const category = (location.state && location.state.category) || "MEAL";

  const handleSubmit = (data) => {
    // 추후 API 연결
    console.log("카테고리 매칭 신청", { category, ...data });
    navigate("/matching/category/waiting", { state: { category } });
  };

  return (
    <div className="page MatchingCategoryForm_wrap">
      <MatchingHeader title={categoryLabels[category]} />
      <CategoryMatchingFormPage
        initialValues={{ admissionYearMin: 22, admissionYearMax: 22 }}
        onSubmit={handleSubmit}
      />
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingCategoryForm;
