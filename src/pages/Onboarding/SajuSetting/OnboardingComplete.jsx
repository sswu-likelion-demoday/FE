import { useNavigate } from "react-router-dom";
import "./OnboardingComplete.scss";
import BottomButton from "../Preference/components/BottomButton";
import logo_word_white from "../../../assets/images/Onboarding/logo_word_white.svg";
import PreferenceComplete_star from "../../../assets/images/Onboarding/PreferenceComplete_icon.svg";
import OnboardingComplete_symbol from '../../../assets/images/Onboarding/OnboardingComplete_symbol.svg'

const OnboardingComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="page OnboardingComplete_wrap">
      <div className="onboardingcomplete_top">
        <img src={logo_word_white} alt="" />
        <img src={OnboardingComplete_symbol} alt="" className="oc_t_symbol" />
        <img src={PreferenceComplete_star} alt="" className="oc_t_star01" />
        <img src={PreferenceComplete_star} alt="" className="oc_t_star02" />
        <img src={PreferenceComplete_star} alt="" className="oc_t_star03" />
      </div>
      <div className="onboardingcomplete_main">
        <p>마지막 설정 완료!</p>
        <span>
          그럼 이제 새로운
          <br />
          수정을 만나러 가볼까요?
        </span>
      </div>
      <div className="onboardingcomplete_bot">
        <BottomButton onClick={() => navigate("/mypage")}>
          확인
        </BottomButton>
      </div>
    </div>
  );
};

export default OnboardingComplete;
