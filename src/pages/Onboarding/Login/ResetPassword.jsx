import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../../api/auth";

import "./ResetPassword.scss";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const studentNumber = location.state?.studentNumber || "";
  const email = location.state?.email || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleResetPassword = async () => {
    if (!email || !studentNumber) {
      alert("이메일 인증을 먼저 진행해 주세요.");
      return;
    }

    if (!password || password !== passwordConfirm || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await resetPassword(email, studentNumber, password);

      alert("비밀번호가 변경되었습니다.");
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page ResetPassword_wrap">
      <div className="resetpassword_top">비밀번호 재설정</div>
      <div className="resetpassword_main">
        <div className="resetpw_m_1">
          <p>학번</p>
          <div className="resetpw_m_1_box">{studentNumber}</div>
        </div>
        <div className="resetpw_m_2">
          <p>비밀번호</p>
          <div className="resetpw_m_2_box1">
            <input
              type="password"
              placeholder="특수문자 포함 8자리 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="resetpw_m_2_box2">
            <input
              type="password"
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
          onClick={handleResetPassword}
          disabled={
            !password.trim() ||
            !passwordConfirm.trim() ||
            password !== passwordConfirm ||
            isSubmitting
          }
        >
          변경하기
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
