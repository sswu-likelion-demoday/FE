import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupStep02.scss";

const SignupStep02 = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [kakaoId, setKakaoId] = useState("");

  return (
    <div className="page SignupStep02_wrap">
      <div className="signupstep02_top">회원정보 입력</div>
      <div className="signupstep02_main">
        <div className="s02_m_1">
          <p>이름</p>
          <input
            type="text"
            className="s02_m_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="s02_m_2">
          <p>학과</p>
          <input
            type="text"
            placeholder="정확한 학과명을 입력하세요"
            className="s02_m_input"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="s02_m_3">
          <p>카카오톡 ID</p>
          <span>매칭 이후 앱 밖에서 인연을 이어갈 연락수단이에요</span>
          <input
            type="text"
            placeholder="ex) sujeong22"
            className="s02_m_input"
            value={kakaoId}
            onChange={(e) => setKakaoId(e.target.value)}
          />
        </div>
      </div>
      <div className="signupstep02_bot">
        <button
          className={`signupstep02_bot_btn ${
            name.trim() && department.trim() && kakaoId.trim() ? "active" : ""
          }`}
          onClick={() => navigate("/signup/profile")}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SignupStep02;
