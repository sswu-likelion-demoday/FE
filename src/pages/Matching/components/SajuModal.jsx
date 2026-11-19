import { useState } from "react";
import "./SajuModal.scss";
import close_gray from "../../../assets/images/Matching/close_gray.svg";

const SajuModal = ({ onClose, onComplete }) => {
  const [isAllowed, setIsAllowed] = useState(true);
  const [calendar, setCalendar] = useState("solar");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");

  return (
    <div className="saju_modal">
      <div className="saju_modal_box">
        <img
          src={close_gray}
          alt=""
          className="saju_modal_close"
          onClick={onClose}
        />
        <p className="saju_modal_title">사주 매칭 설정</p>

        <div className="saju_modal_allow">
          <p>사주기반 매칭 허용</p>
          <input
            type="checkbox"
            checked={isAllowed}
            onChange={(e) => setIsAllowed(e.target.checked)}
          />
        </div>

        <div className="saju_modal_label birth">
          <p>생년월일</p>
          <div className="saju_modal_calendar">
            <button
              type="button"
              className={calendar === "solar" ? "active" : ""}
              onClick={() => setCalendar("solar")}
            >
              양력
            </button>
            <button
              type="button"
              className={calendar === "lunar" ? "active" : ""}
              onClick={() => setCalendar("lunar")}
            >
              음력
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="ex) 260805"
          className="saju_modal_input"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <p className="saju_modal_label time">태어난 시간</p>
        <input
          type="text"
          placeholder="ex) 12:00"
          className="saju_modal_input"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
        />

        <button
          type="button"
          className="saju_modal_btn"
          onClick={() => onComplete(isAllowed)}
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};

export default SajuModal;
