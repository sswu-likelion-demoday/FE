import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signup } from "../../../api/auth";
import "./SignupStep03.scss";

import prev_btn from "../../../assets/images/Onboarding/prev_btn.svg";
import camera_icon from "../../../assets/images/Onboarding/camera_icon_purple.svg";

const SignupStep03 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (isSubmitting) return;

    if (!nickname.trim() || !password || !passwordConfirm) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const { studentNumber, email, name, department_name } =
      location.state ?? {};

    if (!studentNumber || !email || !name || !department_name) {
      alert("이전 회원가입 단계의 정보가 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const signupData = {
        studentNumber,
        email,
        name,
        department_name,
        nickname: nickname.trim(),
        password,
      };

      await signup(signupData, profileImage);

      alert("회원가입이 완료되었습니다.");
      navigate("/signup/complete", { replace: true });
    } catch (error) {
      alert(error.message || "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setProfileImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
          <div
            className="s03_m_1_icon"
            onClick={() => document.getElementById("profileImage").click()}
          >
            <img
              src={previewImage || camera_icon}
              alt=""
              style={
                previewImage
                  ? { width: "100%", height: "100%", objectFit: "cover" }
                  : {}
              }
            />
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
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
            type="password"
            placeholder="특수문자 포함 8자리 이상"
            className="s03_m_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="s03_m_3_box">
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
            password === passwordConfirm &&
            !isSubmitting
              ? "active"
              : ""
          }`}
          onClick={handleSignup}
          disabled={isSubmitting}
        >
          {isSubmitting ? "가입 중" : "가입완료"}
        </button>
      </div>
    </div>
  );
};

export default SignupStep03;
