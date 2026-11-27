import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchingSajuResult.scss";
import { getMatchingStatus, postSajuMatching } from "../../../api/matching";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import saju_1 from "../../../assets/images/Matching/saju_1.svg";
import saju_2 from "../../../assets/images/Matching/saju_2.svg";
import saju_3 from "../../../assets/images/Matching/saju_3.svg";
import saju_4 from "../../../assets/images/Matching/saju_4.svg";
import saju_5 from "../../../assets/images/Matching/saju_5.svg";
import saju_6 from "../../../assets/images/Matching/saju_6.svg";
import saju_7 from "../../../assets/images/Matching/saju_7.svg";
import saju_8 from "../../../assets/images/Matching/saju_8.svg";
import saju_bu from "../../../assets/images/Matching/saju_bu.svg";
import crystal_orb from "../../../assets/images/Matching/crystal_orb.svg";

const sajuCards = [saju_1, saju_2, saju_3, saju_4, saju_5, saju_6, saju_7, saju_8];

const MatchingSajuResult = () => {
  const navigate = useNavigate();

  // 부족한 기운 (확인용 임시 값 - 아직 API 없음)
  const lackElement = "화(火)";

  // 매칭 이용 상태 - 일반 매칭과 무료 횟수를 공유하므로 같은 API 사용
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

  let message = "수정구를 모두 소진했어요";
  if (hasCrystal) {
    message = `수정구 ${matchingCost}개를 이용하여 한번 더 매칭할 수 있어요`;
  }

  // 사주 매칭 실행 - 추천 결과를 매칭 발견 화면으로 넘김
  const [isMatching, setIsMatching] = useState(false);

  const handleMatchingClick = async () => {
    if (isMatching) return;
    setIsMatching(true);
    try {
      const recommendation = await postSajuMatching();
      navigate("/matching/found", { state: { type: "saju", recommendation } });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="page MatchingSajuResult_wrap">
      <MatchingHeader title="사주 매칭" />
      <div className="matchingsajuresult_main">
        <div className="msr_m_cards">
          {sajuCards.map((card, index) => (
            <img key={index} src={card} alt="" />
          ))}
        </div>
        <p className={isZero ? "msr_m_title zero" : "msr_m_title"}>
          ‘{lackElement}’기운이 부족해요
        </p>
        <p className="msr_m_title second">기운을 채워줄 수정을 찾아볼까요?</p>
        <div className="msr_m_crystal">
          <span className="msr_m_glow" />
          <img src={saju_bu} alt="" />
        </div>
        {isZero && (
          <div className="msr_m_badge">
            <img src={crystal_orb} alt="" className="msr_m_orb" />
            수정구 {crystalCount}개
          </div>
        )}
        {isZero && <p className="msr_m_message">{message}</p>}
      </div>
      <div
        className={isZero ? "matchingsajuresult_bot zero" : "matchingsajuresult_bot"}
      >
        {!isZero && (
          <BottomButton onClick={handleMatchingClick}>매칭 시작</BottomButton>
        )}
        {isZero && hasCrystal && (
          <BottomButton onClick={handleMatchingClick}>
            한번 더 매칭
            <img src={crystal_orb} alt="" className="msr_b_orb" />
            -{matchingCost}
          </BottomButton>
        )}
        {isZero && !hasCrystal && (
          <div className="msr_b_wait">매주 월요일 무료 충전</div>
        )}
        <p className="msr_b_count">남은 매칭 횟수 {remainCount}회</p>
      </div>
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingSajuResult;
