import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchingStart.scss";
import { getMatchingStatus, postNormalMatching } from "../../../api/matching";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import normal_matching from "../../../assets/images/Matching/normal_matching.svg";
import crystal_orb from "../../../assets/images/Matching/crystal_orb.svg";

const MatchingStart = () => {
  const navigate = useNavigate();

  // 매칭 이용 상태 - 매칭 이용 횟수 조회 API
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getMatchingStatus()
      .then(setStatus)
      .catch((err) => console.error(err));
  }, []);

  // FREE: 무료 매칭 가능 / CURRENCY: 수정구로 매칭 / INSUFFICIENT_CURRENCY: 수정구 부족
  const actionType = status?.actionType;
  const remainCount = status?.weeklyMatching.remaining ?? 3;
  const crystalCount = status?.currency.balance ?? 0;
  const matchingCost = status?.currency.matchingCost ?? 30;
  const isZero = actionType === "CURRENCY" || actionType === "INSUFFICIENT_CURRENCY";
  const hasCrystal = actionType === "CURRENCY";

  // 일반 매칭 실행 - 추천 결과를 매칭 발견 화면으로 넘김
  const [isMatching, setIsMatching] = useState(false);

  const handleMatch = async () => {
    if (isMatching) return;
    setIsMatching(true);
    try {
      const recommendation = await postNormalMatching();
      navigate("/matching/found", { state: { recommendation } });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsMatching(false);
    }
  };

  let message = "수정구를 모두 소진했어요";
  if (hasCrystal) {
    message = `수정구 ${matchingCost}개를 이용하여 한번 더 매칭할 수 있어요`;
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
          <BottomButton onClick={handleMatch}>
            매칭 시작
          </BottomButton>
        )}
        {isZero && hasCrystal && (
          <BottomButton onClick={handleMatch}>
            한번 더 매칭
            <img src={crystal_orb} alt="" className="ms_b_orb" />
            -{matchingCost}
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
