import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

import prev_btn from "../../../assets/images/Onboarding/prev_btn.svg";
import logo_word_purple from "../../../assets/images/Onboarding/logo_word_purple.svg";

const Login = () => {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="page Login_wrap">
      <div className="login_top">
        <img
          src={prev_btn}
          alt=""
          className="l_t_1"
          onClick={() => navigate("/")}
        />
        <img src={logo_word_purple} alt="" className="l_t_2" />
      </div>
      <div className="login_main">
        <div className="l_m_1">
          <p>학번</p>
          <input
            type="text"
            className="l_m_input"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <div className="l_m_2">
          <p>비밀번호</p>
          <input
            type="text"
            className="l_m_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="login_bot">
        <button
          className={`login_btn ${
            studentId.trim() && password.trim() ? "active" : ""
          }`}
        >
          로그인
        </button>
        <p>비밀번호 찾기</p>
      </div>
    </div>
  );
};

export default Login;
