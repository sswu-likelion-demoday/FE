import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkStudentNumber,
  sendVerificationEmail,
  verifyEmail,
} from "../../../api/auth";
import "./SignupStep01.scss";

import prev_btn from "../../../assets/images/Onboarding/prev_btn.svg";
import del_btn from "../../../assets/images/Onboarding/del_btn.svg";

const SignupStep01 = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(true);

  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");

  const [isChecking, setIsChecking] = useState(false);
  const [checkedStudentId, setCheckedStudentId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(null);

  const handleCheckStudentId = async () => {
    if (!studentId.trim() || isChecking) return;

    setIsChecking(true);

    try {
      const available = await checkStudentNumber(studentId.trim());

      if (available) {
        setCheckedStudentId(studentId.trim());
        alert("사용 가능한 학번입니다.");
      } else {
        setCheckedStudentId(null);
        alert("이미 사용 중인 학번입니다.");
      }
    } catch (error) {
      alert(error.message || "학번 중복 확인에 실패했습니다.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim() || isSending) return;

    setIsSending(true);

    try {
      await sendVerificationEmail(email.trim());
      setVerifiedEmail(null);
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      alert(error.message || "인증번호 발송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!email.trim() || !authCode.trim() || isVerifying) return;

    setIsVerifying(true);

    try {
      await verifyEmail(email.trim(), authCode.trim());
      setVerifiedEmail(email.trim());
      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      setVerifiedEmail(null);
      alert(error.message || "이메일 인증에 실패했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="page Signupstep01_wrap">
      <div className="signupstep01_top">
        <img src={prev_btn} alt="" onClick={() => navigate("/")} />
        <p>재학생 인증</p>
      </div>
      <div className="signupstep01_main">
        <div className="s01_m_1">
          <p>학번</p>
          <div className="s01_m_box">
            <input
              type="text"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setCheckedStudentId(null);
              }}
            />
            <button
              className={studentId.trim() && !isChecking ? "active" : ""}
              onClick={handleCheckStudentId}
              disabled={!studentId.trim() || isChecking}
            >
              {isChecking ? "확인 중" : "중복확인"}
            </button>
          </div>
        </div>

        <div className="s01_m_2">
          <p>재학생 이메일 인증</p>
          <div className="s01_m_box">
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setVerifiedEmail(null);
              }}
            />
            <button
              className={email.trim() && !isSending ? "active" : ""}
              onClick={handleSendEmail}
              disabled={!email.trim() || isSending}
            >
              {isSending ? "전송 중" : "전송"}
            </button>
          </div>
          <div className="s01_m_2_txt">
            <p>인증번호가 발송되지 않았나요?</p>
            <span onClick={handleSendEmail}>다시 시도</span>
          </div>
          <div className="s01_m_2_box">
            <input
              type="text"
              placeholder="인증번호 입력"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
            <button
              className={authCode.trim() && !isVerifying ? "active" : ""}
              onClick={handleVerifyEmail}
              disabled={!authCode.trim() || isVerifying}
            >
              {isVerifying ? "확인 중" : "인증완료"}
            </button>
          </div>
        </div>

        <div className="s01_m_3">
          <p>졸업생이신가요?</p>
          <span>졸업인증</span>
        </div>
      </div>
      <div className="signupstep01_bot">
        <button
          className={`signupstep01_bot_btn ${
            studentId.trim() &&
            checkedStudentId === studentId.trim() &&
            email.trim() &&
            verifiedEmail === email.trim()
              ? "active"
              : ""
          }`}
          onClick={() => {
            if (!studentId.trim() || checkedStudentId !== studentId.trim()) {
              alert("학번 중복확인을 완료해주세요.");
              return;
            }

            if (!email.trim() || verifiedEmail !== email.trim()) {
              alert("이메일 인증을 완료해주세요.");
              return;
            }

            navigate("/signup/basic-info", {
              state: {
                studentNumber: studentId.trim(),
                email: email.trim(),
              },
            });
          }}
        >
          다음
        </button>
      </div>

      {isModalOpen && (
        <div className="signupstep01_modal_wrap">
          <div className="s01_modal_box">
            <div className="s01_modal_top">
              <img src={del_btn} alt="" onClick={() => navigate("/")} />
              <p>가입제한 안내</p>
            </div>
            <div className="s01_modal_main">
              <p>
                수정구함은
                <br />
                수정이들의 다양한 만남을
                <br />
                지원하기 위해 만들어진
                <br />
                <span>성신여자대학교만의</span>
                <br />
                친구 매칭 서비스입니다.
                <br />
                <br />
                안전한 이용을 위해
                <br />
                성신여자대학교의 재학생임을
                <br />
                확인하기 위한 절차가 필요해요.
              </p>
            </div>
            <button
              className="s01_modal_bot"
              onClick={() => setIsModalOpen(false)}
            >
              재학생 인증하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupStep01;
