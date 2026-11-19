import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingSaju.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import SajuModal from "../components/SajuModal";
import logo_symbol_2 from "../../../assets/images/Onboarding/logo_symbol_2.svg";

const MatchingSaju = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 사주 매칭을 허용하지 않은 사람은 설정 창부터 보여줌
  const [showSetting, setShowSetting] = useState(
    location.state ? location.state.showSetting : false,
  );

  // 설정 창이 없을 때 12초 기다린 뒤 결과 화면으로 이동
  useEffect(() => {
    if (showSetting) return;

    const timer = setTimeout(() => {
      navigate("/matching/saju/result", { replace: true });
    }, 12000);

    return () => clearTimeout(timer);
  }, [showSetting, navigate]);

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
          onComplete={() => setShowSetting(false)}
        />
      )}
    </div>
  );
};

export default MatchingSaju;
