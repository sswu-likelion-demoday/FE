import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./MatchingFound.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import card_matching from "../../../assets/images/Matching/card_matching.svg";

const MatchingFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인/회원가입 때 저장한 닉네임
  const nickname = sessionStorage.getItem("nickname");

  // 사주 매칭에서 넘어왔는지
  const isSaju = location.state && location.state.type === "saju";

  // 매칭 실행 API 결과 (매칭 시작 / 사주 결과 화면에서 넘겨받음)
  const recommendation = location.state?.recommendation;
  const candidate = recommendation?.candidate;

  // 주소로 바로 들어오거나 새로고침해서 매칭 결과가 없으면 매칭 홈으로 이동
  if (!candidate) {
    return <Navigate to="/matching" replace />;
  }

  // 사주 궁합 점수
  const sajuScore = recommendation.compatibilityScore;

  // 매칭된 사람
  let profile = {
    name: candidate.nickname,
    studentId: candidate.admissionYear ?? "",
    description: candidate.introduction ?? "",
    type: "found",
    recommendationId: recommendation.recommendationId,
    userId: candidate.userId,
  };

  if (isSaju) {
    profile = {
      ...profile,
      description: sajuScore != null ? `사주 궁합이 ${sajuScore}점이에요` : "",
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
            {nickname ? `${nickname}님을 위한` : "나를 위한"}
            <br />
            수정을 발견했어요!
          </p>
        )}
        <div className="mf_m_card">
          <img src={card_matching} alt="" />
          {isSaju && sajuScore != null && <p className="mf_m_score">{sajuScore}점</p>}
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
