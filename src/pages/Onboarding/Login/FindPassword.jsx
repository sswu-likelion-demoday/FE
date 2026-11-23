import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerificationEmail, verifyEmail } from "../../../api/auth";

import "./FindPassword.scss";

import prev_btn from "../../../assets/images/Onboarding/prev_btn.svg";

const FindPassword = () => {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim()) return;

    try {
      await sendVerificationEmail(email.trim());
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerifyEmail = async () => {
    if (!email.trim() || !authCode.trim()) return;

    try {
      await verifyEmail(email.trim(), authCode.trim());
      setIsEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      setIsEmailVerified(false);
      alert(error.message);
    }
  };

  return (
    <div className="page FindPassword_wrap">
      <div className="findpassword_top">
        <img src={prev_btn} alt="" onClick={() => navigate("/login")} />
        <p>비밀번호 찾기</p>
      </div>

      <div className="findpassword_main">
        <div className="findpw_m_1">
          <p>학번</p>
          <div className="findpw_m_1_box">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
        </div>

        <div className="findpw_m_2">
          <p>이메일 인증</p>
          <div className="findpw_m_2_box1">
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailVerified(false);
              }}
            />
            <button
              className={email.trim() ? "active" : ""}
              onClick={handleSendEmail}
              disabled={!email.trim()}
            >
              전송
            </button>
          </div>

          <div className="findpw_m_2_txt">
            <p>인증번호가 발송되지 않았나요?</p>
            <span>다시 시도</span>
          </div>

          <div className="findpw_m_2_box2">
            <input
              type="text"
              placeholder="인증번호 입력"
              value={authCode}
              onChange={(e) => {
                setAuthCode(e.target.value);
                setIsEmailVerified(false);
              }}
            />
            <button
              className={authCode.trim() ? "active" : ""}
              onClick={handleVerifyEmail}
              disabled={!authCode.trim() || isEmailVerified}
            >
              인증완료
            </button>
          </div>
        </div>
      </div>

      <div className="findpassword_bot">
        <button
          className={`findpassword_bot_btn ${
            studentId.trim() && isEmailVerified ? "active" : ""
          }`}
          disabled={!studentId.trim() || !isEmailVerified}
          onClick={() =>
            navigate("/login/reset-password", {
              state: {
                studentNumber: studentId.trim(),
                email: email.trim(),
              },
            })
          }
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default FindPassword;
