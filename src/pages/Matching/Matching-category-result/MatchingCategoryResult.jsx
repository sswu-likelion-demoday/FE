import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingCategoryResult.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategoryMatchResultPage from "../components/CategoryMatchResultPage";
import { categoryLabels } from "../data/categoryData";

const MatchingCategoryResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 매칭된 카테고리 (없으면 밥약)
  const category = (location.state && location.state.category) || "MEAL";

  // 결과 상세 조회 API의 members를 결과 카드 형식으로 변환 (매칭 완료 화면에서 넘겨받음)
  const members = location.state?.result?.members ?? [];
  const profiles = members.map((member) => ({
    id: member.userId,
    image: member.profileImageUrl,
    nickname: member.name,
    department: member.departmentName,
    studentId: member.admissionYear,
    mbti: member.mbti,
    kakaoId: member.contact,
  }));

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
