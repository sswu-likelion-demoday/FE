import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingCategoryFound.scss";
import { getCategoryMatchResult } from "../../../api/matching";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategoryMatchFoundPage from "../components/CategoryMatchFoundPage";
import { categoryLabels } from "../data/categoryData";

const MatchingCategoryFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 매칭된 카테고리 (없으면 밥약), 카테고리 매칭 신청 ID
  const category = (location.state && location.state.category) || "MEAL";
  const requestId = location.state?.requestId;

  // 매칭된 수정 확인하기 - 결과 상세 조회 API 결과를 결과 화면으로 넘김
  const [isLoading, setIsLoading] = useState(false);

  const handleViewResults = async () => {
    if (isLoading) return;
    if (requestId == null) {
      alert("매칭 정보를 찾을 수 없어요. 다시 시도해 주세요.");
      navigate("/matching/category", { replace: true });
      return;
    }
    setIsLoading(true);
    try {
      const result = await getCategoryMatchResult(requestId);
      navigate("/matching/category/result", {
        state: { category: result.category ?? category, requestId, result },
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page MatchingCategoryFound_wrap">
      <MatchingHeader title={categoryLabels[category]} />
      <CategoryMatchFoundPage onViewResults={handleViewResults} />
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingCategoryFound;
