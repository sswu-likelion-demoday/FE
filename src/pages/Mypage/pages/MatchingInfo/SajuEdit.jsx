import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";
import BottomButton from "../../../Onboarding/Preference/components/BottomButton";
import "./SajuEdit.scss";

const SajuEdit = () => {
  const navigate = useNavigate();

  const [isAllowed, setIsAllowed] = useState(true);
  const [calendarType, setCalendarType] = useState("양력");
  const [birthDate, setBirthDate] = useState("040805");
  const [birthTime, setBirthTime] = useState("12:00");

  return (
    <div className="page SajuEdit_wrap">
      <div className="sajuedit_header">
        <MypageHeader
          title="사주 매칭"
          onBack={() => navigate("/mypage/matching-info")}
        />
      </div>

      <div className="sajuedit_main">
        <div className="sajuedit_top">
          <h2>
            사주 매칭 정보를
            <br />
            수정해 주세요
          </h2>
          <p>매칭 허용 여부는 언제든 바꿀 수 있어요</p>
        </div>

        <div className="sajuedit_toggle">
          <span>사주기반 매칭 허용</span>
          <button
            type="button"
            className={`sajuedit_switch ${isAllowed ? "active" : ""}`}
            role="switch"
            aria-label="사주기반 매칭 허용"
            aria-checked={isAllowed}
            onClick={() => setIsAllowed(!isAllowed)}
          />
        </div>

        <div className="sajuedit_birth">
          <div className="sajuedit_birth_top">
            <label htmlFor="saju-birth-date">생년월일</label>
            <div className="sajuedit_calendar">
              {["양력", "음력"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={calendarType === type ? "selected" : ""}
                  aria-pressed={calendarType === type}
                  onClick={() => setCalendarType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <input
            id="saju-birth-date"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="생년월일 6자리"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div className="sajuedit_time">
          <label htmlFor="saju-birth-time">태어난 시간</label>
          <input
            id="saju-birth-time"
            type="text"
            placeholder="12:00"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
          />
          <p>태어난 시간을 모르면 비워두셔도 돼요</p>
        </div>
      </div>

      <div className="sajuedit_bottom">
        <BottomButton onClick={() => navigate("/mypage/matching-info")}>
          저장하기
        </BottomButton>
        <p>사주 정보는 사주 매칭에만 사용돼요</p>
      </div>
    </div>
  );
};

export default SajuEdit;
