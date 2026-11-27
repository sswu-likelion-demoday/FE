import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchingSaju.scss";
import { getSajuSettings, saveSajuSettings } from "../../../api/matching";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import SajuModal from "../components/SajuModal";
import logo_symbol_2 from "../../../assets/images/Onboarding/logo_symbol_2.svg";

const MatchingSaju = () => {
  const navigate = useNavigate();

  // 사주 매칭 허용 여부 - 사주 매칭 설정 조회 API (null: 확인 중)
  const [isAllowed, setIsAllowed] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getSajuSettings()
      .then((data) => active && setIsAllowed(data.matchingEnabled))
      .catch((err) => {
        if (!active) return;
        alert(err.message);
        navigate("/matching", { replace: true });
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  // 사주 매칭을 허용하지 않은 사람은 설정 창부터 보여줌
  const showSetting = isAllowed === false;

  // 허용된 상태면 6초 기다린 뒤 결과 화면으로 이동
  useEffect(() => {
    if (!isAllowed) return;

    const timer = setTimeout(() => {
      navigate("/matching/saju/result", { replace: true });
    }, 6000);

    return () => clearTimeout(timer);
  }, [isAllowed, navigate]);

  // 설정 완료 - 허용하지 않으면 매칭 홈으로, 허용하면 저장 후 진행
  const handleComplete = async (settings) => {
    if (!settings.matchingEnabled) {
      navigate("/matching");
      return;
    }
    if (isSaving) return;
    setIsSaving(true);
    try {
      const saved = await saveSajuSettings(settings);
      setIsAllowed(saved.matchingEnabled);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page MatchingSaju_wrap">
      <MatchingHeader title="사주 매칭" />
      <div className="matchingsaju_main">
        <div className="msj_m_orb">
          <span className="msj_m_glow" />
          <img src={logo_symbol_2} alt="" />
        </div>
        <p className="msj_m_text">수정의 기운을 확인하고 있어요</p>
        <p className="msj_m_text second">잠시만 기다려주세요</p>
      </div>
      <BottomNav initialMenu="matching" />
      {showSetting && (
        <SajuModal
          onClose={() => navigate("/matching")}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default MatchingSaju;
