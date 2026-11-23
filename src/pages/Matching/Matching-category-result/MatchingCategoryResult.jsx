import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingCategoryResult.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategoryMatchResultPage from "../components/CategoryMatchResultPage";
import { categoryLabels } from "../data/categoryData";

// 매칭된 수정들 (확인용 임시 데이터)
const profiles = [
  {
    id: 1,
    nickname: "수정1",
    department: "컴퓨터공학과",
    studentId: 22,
    mbti: "INFJ",
    kakaoId: "sujeong1",
  },
  {
    id: 2,
    nickname: "수정2",
    department: "경영학과",
    studentId: 22,
    mbti: "ENFP",
    kakaoId: "sujeong2",
  },
];

const MatchingCategoryResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 매칭된 카테고리 (없으면 밥약)
  const category = (location.state && location.state.category) || "MEAL";

  return (
    <div className="page MatchingCategoryResult_wrap">
      <MatchingHeader title={categoryLabels[category]} />
      <CategoryMatchResultPage
        profiles={profiles}
        onComplete={() => navigate("/matching")}
      />
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingCategoryResult;
