import { useNavigate } from "react-router-dom";
import "./PreferenceComplete.scss";
import BottomButton from "./components/BottomButton";
import logo_word_white from "../../../assets/images/Onboarding/logo_word_white.svg";
import PreferenceComplete_star from "../../../assets/images/Onboarding/PreferenceComplete_icon.svg";

const PreferenceComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="page PreferenceComplete_wrap">
      <div className="preferencecomplete_top">
        <img src={logo_word_white} alt="" />
        <img src={PreferenceComplete_star} alt="" className="pc_t_star01" />
        <img src={PreferenceComplete_star} alt="" className="pc_t_star02" />
        <img src={PreferenceComplete_star} alt="" className="pc_t_star03" />
        <img src={PreferenceComplete_star} alt="" className="pc_t_star04" />
      </div>
      <div className="preferencecomplete_main">
        <p>매칭 유형 파악 완료!</p>
        <span>
          사주 기반 매칭을 위한
          <br />
          마지막 설정이 남았어요
        </span>
      </div>
      <div className="preferencecomplete_bot">
        <BottomButton onClick={() => navigate("/signup/saju-setting")}>
          설정하기
        </BottomButton>
      </div>
    </div>
  );
};

export default PreferenceComplete;
