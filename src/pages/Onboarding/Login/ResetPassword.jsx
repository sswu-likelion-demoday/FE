import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ResetPassword.scss";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  return (
    <div className="page ResetPassword_wrap">
      <div className="resetpassword_top">비밀번호 재설정</div>
      <div className="resetpassword_main">
        <div className="resetpw_m_1">
          <p>학번</p>
          <div className="resetpw_m_1_box">20220879</div>
        </div>
        <div className="resetpw_m_2">
          <p>비밀번호</p>
          <div className="resetpw_m_2_box1">
            <input
              type="text"
              placeholder="특수문자 포함 8자리 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="resetpw_m_2_box2">
            <input
              type="text"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <p
              className={
                passwordConfirm
                  ? password === passwordConfirm
                    ? "active"
                    : "error"
                  : ""
              }
            >
              {passwordConfirm && password !== passwordConfirm
                ? "불일치"
                : "일치"}
            </p>
          </div>
        </div>
      </div>
      <div className="resetpassword_bot">
        <button
          className={`resetpassword_bot_btn ${
            password.trim() &&
            passwordConfirm.trim() &&
            password === passwordConfirm
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/login")}
        >
          변경하기
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
