import { useId, useState } from "react";
import "./SajuSetting.scss";

const SajuSetting = () => {
  const [isAllowed, setIsAllowed] = useState(true);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const birthDateId = useId();
  const birthTimeId = useId();

  const isActive =
    !isAllowed || (birthDate.trim() !== "" && birthTime.trim() !== "");

  const handleComplete = () => {
    if (!isActive) return;

    try {
      localStorage.setItem(
        "sajuSettings",
        JSON.stringify({
          isAllowed,
          birthDate: isAllowed ? birthDate.trim() : "",
          birthTime: isAllowed ? birthTime.trim() : "",
        })
      );
      setSaveMessage("설정이 저장되었어요.");
    } catch {
      setSaveMessage("설정을 저장하지 못했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="page SajuSetting_wrap">
      <div className="sajusetting_top">사주 매칭 설정</div>
      <div className="sajusetting_main">
        <div className="s_m_1">
          <p>사주기반 매칭 허용</p>
          <input
            type="checkbox"
            checked={isAllowed}
            onChange={(e) => {
              setIsAllowed(e.target.checked);
              setSaveMessage("");
            }}
            aria-label="사주기반 매칭 허용"
          />
        </div>

        {isAllowed && (
          <>
            <div className="s_m_2">
              <div className="s_m_2_top">
                <label htmlFor={birthDateId}>생년월일</label>
                <input type="radio" />
              </div>
              <input
                id={birthDateId}
                type="text"
                placeholder="ex) 260805"
                className="s_m_input"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setSaveMessage("");
                }}
              />
            </div>

            <div className="s_m_3">
              <label htmlFor={birthTimeId}>태어난 시간</label>
              <input
                id={birthTimeId}
                type="text"
                placeholder="ex) 12:00"
                className="s_m_input"
                value={birthTime}
                onChange={(e) => {
                  setBirthTime(e.target.value);
                  setSaveMessage("");
                }}
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
          type="button"
          disabled={!isActive}
          onClick={handleComplete}
          className={`sajusetting_bot_btn ${
            isActive ? "active" : ""
          } ${!isAllowed ? "off" : ""}`}
        >
          설정 완료
        </button>
        <p className="sajusetting_status" role="status">{saveMessage}</p>
      </div>
    </div>
  );
};

export default SajuSetting;
