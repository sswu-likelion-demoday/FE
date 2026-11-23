import { useNavigate } from "react-router-dom";
import "./MatchingCategory.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategorySelectPage from "../components/CategorySelectPage";

const MatchingCategory = () => {
  const navigate = useNavigate();

  // 카테고리별 매칭된 수정 수 (확인용 임시 값)
  const badgeCounts = { MEAL: 1 };

  // 매칭된 수정이 있으면 발견 화면, 없으면 신청 화면으로 이동
  const handleSelect = (category) => {
    if (badgeCounts[category] > 0) {
      navigate("/matching/category/found", { state: { category } });
    } else {
      navigate("/matching/category/form", { state: { category } });
    }
  };

  const handleRequestCategory = () => {
    console.log("카테고리 생성 요청");
  };

  return (
    <div className="page MatchingCategory_wrap">
      <MatchingHeader title="카테고리 선택" onBack={() => navigate("/matching")} />
      <CategorySelectPage
        badgeCounts={badgeCounts}
        onSelect={handleSelect}
        onRequestCategory={handleRequestCategory}
      />
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingCategory;
