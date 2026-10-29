import { useState } from "react";
import "./SajuSetting.scss";

const SajuSetting = () => {
  const [isAllowed, setIsAllowed] = useState(true);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");

  const isActive =
    !isAllowed || (birthDate.trim() !== "" && birthTime.trim() !== "");

  return (
    <div className="page SajuSetting_wrap">
      <div className="sajusetting_top">사주 매칭 설정</div>
      <div className="sajusetting_main">
        <div className="s_m_1">
          <p>사주기반 매칭 허용</p>
          <input
            type="checkbox"
            checked={isAllowed}
            onChange={(e) => setIsAllowed(e.target.checked)}
            aria-label="사주기반 매칭 허용"
          />
        </div>

        {isAllowed && (
          <>
            <div className="s_m_2">
              <div className="s_m_2_top">
                <p>생년월일</p>
                <input type="radio" />
              </div>
              <input
                type="text"
                placeholder="ex) 260805"
                className="s_m_input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="s_m_3">
              <p>태어난 시간</p>
              <input
                type="text"
                placeholder="ex) 12:00"
                className="s_m_input"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
              />
            </div>
          </>
        )}

        {!isAllowed && (
          <p className="sajusetting_off">
            허용 여부는 사주매칭 시
            <br />
            혹은 마이페이지에서 변경할 수 있어요
          </p>
        )}
      </div>

      <div className={`sajusetting_bot ${!isAllowed ? "off" : ""}`}>
        <button
          className={`sajusetting_bot_btn ${
            isActive ? "active" : ""
          } ${!isAllowed ? "off" : ""}`}
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};

export default SajuSetting;
