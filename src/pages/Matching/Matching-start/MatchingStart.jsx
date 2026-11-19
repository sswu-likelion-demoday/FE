import { useNavigate } from "react-router-dom";
import "./MatchingStart.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import normal_matching from "../../../assets/images/Matching/normal_matching.svg";
import crystal_orb from "../../../assets/images/Matching/crystal_orb.svg";

const MatchingStart = () => {
  const navigate = useNavigate();

  // 남은 매칭 횟수, 수정구 개수 (확인용 임시 값)
  const remainCount = 3;
  const crystalCount = 100;
  const hasCrystal = crystalCount >= 30;
  const isZero = remainCount === 0;

  let message = "수정구를 모두 소진했어요";
  if (hasCrystal) {
    message = "수정구 30개를 이용하여 한번 더 매칭할 수 있어요";
  }

  return (
    <div className="page MatchingStart_wrap">
      <MatchingHeader title="매칭" />
      <div className="matchingstart_main">
        <p className="ms_m_title">
          하나의 수정을
          <br />더 연결할 수 있어요!
        </p>
        <img src={normal_matching} alt="" className="ms_m_crystal" />
        {!isZero && <p className="ms_m_question">어떤 수정이 나타날까요?</p>}
        {isZero && (
          <div className="ms_m_badge">
            <img src={crystal_orb} alt="" className="ms_m_orb" />
            수정구 {crystalCount}개
          </div>
        )}
        {isZero && <p className="ms_m_message">{message}</p>}
      </div>
      <div className={isZero ? "matchingstart_bot zero" : "matchingstart_bot"}>
        {!isZero && (
          <BottomButton onClick={() => navigate("/matching/found")}>
            매칭 시작
          </BottomButton>
        )}
        {isZero && hasCrystal && (
          <BottomButton onClick={() => navigate("/matching/found")}>
            한번 더 매칭
            <img src={crystal_orb} alt="" className="ms_b_orb" />
            -30
          </BottomButton>
        )}
        {isZero && !hasCrystal && (
          <div className="ms_b_wait">매주 월요일 무료 충전</div>
        )}
        <p className="ms_b_count">남은 매칭 횟수 {remainCount}회</p>
      </div>
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingStart;
