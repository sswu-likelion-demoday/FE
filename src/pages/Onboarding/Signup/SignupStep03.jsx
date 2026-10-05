import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupStep03.scss";

import prev_btn from "../../../assets/images/Onboarding/prev_btn.svg";
import camera_icon from "../../../assets/images/Onboarding/camera_icon_purple.svg";

const SignupStep03 = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  return (
    <div className="page SignupStep03_wrap">
      <div className="signupstep03_top">
        <img
          src={prev_btn}
          alt=""
          onClick={() => navigate("/signup/basic-info")}
        />
        <p>회원정보 입력</p>
      </div>
      <div className="signupstep03_main">
        <div className="s03_m_1">
          <p>사진 등록</p>
          <div className="s03_m_1_icon">
            <img src={camera_icon} alt="" />
          </div>
        </div>
        <div className="s03_m_2">
          <p>닉네임</p>
          <input
            type="text"
            className="s03_m_input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="s03_m_3">
          <p>비밀번호</p>
          <input
            type="text"
            placeholder="특수문자 포함 8자리 이상"
            className="s03_m_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="s03_m_3_box">
            <input
              type="text"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <p className={passwordConfirm.trim() ? "active" : ""}>일치</p>
          </div>
        </div>
        <div className="s03_m_4">
          사진을 등록하지 않으면 기본 이미지가 적용돼요
        </div>
      </div>
      <div className="signupstep03_bot">
        <button
          className={`signupstep03_bot_btn ${
            nickname.trim() &&
            password.trim() &&
            passwordConfirm.trim() &&
            password === passwordConfirm
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/signup/complete")}
        >
          가입완료
        </button>
      </div>
    </div>
  );
};

export default SignupStep03;
