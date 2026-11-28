import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingCategoryForm.scss";
import { createCategoryMatch } from "../../../api/matching";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategoryMatchingFormPage from "../components/CategoryMatchingFormPage";
import { categoryLabels } from "../data/categoryData";

const MatchingCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 선택한 카테고리 (없으면 밥약)
  const category = (location.state && location.state.category) || "MEAL";

  // 카테고리 매칭 신청 - 신청 후 매칭 대기 화면으로 이동
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const created = await createCategoryMatch({ category, ...data });
      navigate("/matching/category/waiting", {
        state: { category, requestId: created.requestId },
        replace: true,
      });
    } catch (err) {
      alert(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="page MatchingCategoryForm_wrap">
      <MatchingHeader title={categoryLabels[category]} />
      <CategoryMatchingFormPage
        initialValues={{ admissionYearMin: 22, admissionYearMax: 22 }}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingCategoryForm;
