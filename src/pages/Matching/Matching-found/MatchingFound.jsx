import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingFound.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import card_matching from "../../../assets/images/Matching/card_matching.svg";

const MatchingFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 사주 매칭에서 넘어왔는지, 사주 궁합 점수 (확인용 임시 값)
  const isSaju = location.state && location.state.type === "saju";
  const sajuScore = 85;

  // 일반 매칭 실행 API 결과 (매칭 시작 화면에서 넘겨받음)
  const candidate = location.state?.recommendation?.candidate;

  // 매칭된 사람 (API 결과가 없으면 확인용 임시 데이터)
  let profile = {
    name: candidate?.nickname ?? "달빛여우",
    studentId: candidate ? candidate.admissionYear ?? "" : "24",
    description: candidate?.introduction ?? "같은 취미를 가졌어요",
    type: "found",
    recommendationId: location.state?.recommendation?.recommendationId,
    userId: candidate?.userId,
  };

  if (isSaju) {
    profile = {
      name: "고양이 집사",
      studentId: "22",
      description: "사주 궁합이 80점 이상이에요",
      type: "found",
      saju: true,
    };
  }

  return (
    <div className="page MatchingFound_wrap">
      <MatchingHeader title={isSaju ? "사주 매칭" : "매칭"} />
      <div className="matchingfound_main">
        {isSaju ? (
          <p className="mf_m_title">
            부족한 기운을 채워줄
            <br />
            수정을 찾았어요!
          </p>
        ) : (
          <p className="mf_m_title">
            나리님을 위한
            <br />
            수정을 발견했어요!
          </p>
        )}
        <div className="mf_m_card">
          <img src={card_matching} alt="" />
          {isSaju && <p className="mf_m_score">{sajuScore}점</p>}
        </div>
        <p className="mf_m_question">확인해볼까요?</p>
      </div>
      <div className="matchingfound_bot">
        <BottomButton
          onClick={() =>
            navigate("/matching/request/profile", { state: profile })
          }
        >
          프로필 확인하기
        </BottomButton>
        <p className="mf_b_stop" onClick={() => navigate("/matching")}>
          그만두기
        </p>
      </div>
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingFound;
