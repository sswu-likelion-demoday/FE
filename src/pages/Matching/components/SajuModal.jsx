import { useState } from "react";
import "./SajuModal.scss";
import close_gray from "../../../assets/images/Matching/close_gray.svg";

// "040805" → "2004-08-05" (올해 연도 뒷자리보다 크면 1900년대로 봄)
const toBirthDate = (value) => {
  const digits = value.replace(/\D/g, "");
  if (!/^\d{6}$/.test(digits)) return null;
  const yy = Number(digits.slice(0, 2));
  const mm = Number(digits.slice(2, 4));
  const dd = Number(digits.slice(4, 6));
  const currentYY = new Date().getFullYear() % 100;
  const year = (yy > currentYY ? 1900 : 2000) + yy;
  const date = new Date(year, mm - 1, dd);
  if (date.getMonth() !== mm - 1 || date.getDate() !== dd || date > new Date()) {
    return null;
  }
  return `${year}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
};

// "9:30" / "0930" → "09:30"
const toBirthTime = (value) => {
  const match = value.trim().match(/^(\d{1,2}):?(\d{2})$/);
  if (!match) return null;
  const hh = Number(match[1]);
  const mm = Number(match[2]);
  if (hh > 23 || mm > 59) return null;
  return `${String(hh).padStart(2, "0")}:${match[2]}`;
};

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
          onClick={() => {
            if (!isAllowed) {
              onComplete({ matchingEnabled: false });
              return;
            }
            const date = toBirthDate(birthDate);
            const time = toBirthTime(birthTime);
            if (!date) {
              alert("생년월일을 6자리로 입력해 주세요. ex) 040805");
              return;
            }
            if (!time) {
              alert("태어난 시간을 입력해 주세요. ex) 12:00");
              return;
            }
            onComplete({
              matchingEnabled: true,
              calendarType: calendar === "lunar" ? "LUNAR" : "SOLAR",
              birthDate: date,
              birthTime: time,
            });
          }}
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};

export default SajuModal;
