import { useNavigate } from "react-router-dom";
import "./SignupStep04.scss";

import line1 from "../../../assets/images/Onboarding/line1.svg";
import line2 from "../../../assets/images/Onboarding/line2.svg";
import line3 from "../../../assets/images/Onboarding/line3.svg";
import line4 from "../../../assets/images/Onboarding/line4.svg";
import line5 from "../../../assets/images/Onboarding/line5.svg";
import line6 from "../../../assets/images/Onboarding/line6.svg";
import logo_word_white from "../../../assets/images/Onboarding/logo_word_white.svg";
import logo_symbol_2 from "../../../assets/images/Onboarding/logo_symbol_2.svg";

const SignupStep04 = () => {
  const navigate = useNavigate();

  return (
    <div className="page SignupStep04_wrap">
      <div className="signupStep04_top">
        <div className="signupStep04_line_box">
          <img src={line1} alt="" className="signupStep04_line1" />
          <img src={line2} alt="" className="signupStep04_line2" />
          <img src={line3} alt="" className="signupStep04_line3" />
          <img src={line4} alt="" className="signupStep04_line4" />
          <img src={line5} alt="" className="signupStep04_line5" />
          <img src={line6} alt="" className="signupStep04_line6" />
        </div>
        <img src={logo_word_white} alt="" className="signupstep04_word" />
      </div>
      <div className="signupStep04_main">
        <img src={logo_symbol_2} alt="" className="signupStep04_symbol" />
        <span>가입 완료</span>
        <p>
          수정구함에
          <br />
          오신 것을 환영해요!
        </p>
      </div>
      <div className="signupStep04_bot">
        <button className="signupStep04_login_btn" onClick={() => navigate("/")}>로그인</button>
      </div>
    </div>
  );
};

export default SignupStep04;
