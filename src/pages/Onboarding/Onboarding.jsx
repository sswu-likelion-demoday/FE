import { useNavigate } from "react-router-dom";
import "./Onboarding.scss";

import line1 from "../../assets/images/Onboarding/line1.svg";
import line2 from "../../assets/images/Onboarding/line2.svg";
import line3 from "../../assets/images/Onboarding/line3.svg";
import line4 from "../../assets/images/Onboarding/line4.svg";
import line5 from "../../assets/images/Onboarding/line5.svg";
import line6 from "../../assets/images/Onboarding/line6.svg";
import logo_symbol from "../../assets/images/Onboarding/logo_symbol.svg";
import logo_word_purple from "../../assets/images/Onboarding/logo_word_purple.svg";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="page Onboarding_wrap">
      <div className="onboarding_top">
        <div className="onboarding_line_box">
          <img src={line1} alt="" className="onboarding_line1" />
          <img src={line2} alt="" className="onboarding_line2" />
          <img src={line3} alt="" className="onboarding_line3" />
          <img src={line4} alt="" className="onboarding_line4" />
          <img src={line5} alt="" className="onboarding_line5" />
          <img src={line6} alt="" className="onboarding_line6" />
        </div>
        <img src={logo_symbol} alt="" className="onboarding_symbol" />
      </div>
      <div className="onboarding_main">
        <img src={logo_word_purple} alt="" />
        <p>
          이곳에서
          <br />
          어떤 수정을 만나게 될까요?
        </p>
      </div>
      <div className="onboarding_bot">
        <button
          className="onboarding_login_btn"
          onClick={() => navigate("/login")}
        >
          로그인
        </button>
        <button
          className="onboarding_signup_btn"
          onClick={() => navigate("/signup/student-verification")}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
