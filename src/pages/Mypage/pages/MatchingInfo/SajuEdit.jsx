import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateSajuSettings } from "../../../../api/mypage";
import MypageHeader from "../../components/MypageHeader";
import BottomButton from "../../../Onboarding/Preference/components/BottomButton";
import "./SajuEdit.scss";

const SajuEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const saju = location.state?.saju;

  const [isAllowed, setIsAllowed] = useState(saju?.enabled ?? false);
  const [calendarType, setCalendarType] = useState(
    saju?.calendarType ?? "SOLAR",
  );
  const [birthDate, setBirthDate] = useState(saju?.birthDate ?? "");
  const [birthTime, setBirthTime] = useState(saju?.birthTime ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (isAllowed && !birthDate) {
      alert("생년월일을 입력해 주세요.");
      return;
    }

    const sajuData = isAllowed
      ? {
          enabled: true,
          birthDate,
          calendarType,
          ...(birthTime && { birthTime }),
        }
      : {
          enabled: false,
        };

    try {
      setIsSaving(true);

      await updateSajuSettings(accessToken, sajuData);

      alert("사주 매칭 설정이 저장되었습니다.");
      navigate("/mypage/matching-info");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

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
              {[
                { label: "양력", value: "SOLAR" },
                { label: "음력", value: "LUNAR" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={calendarType === type.value ? "selected" : ""}
                  aria-pressed={calendarType === type.value}
                  onClick={() => setCalendarType(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <input
            id="saju-birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        <div className="sajuedit_time">
          <label htmlFor="saju-birth-time">태어난 시간</label>
          <input
            id="saju-birth-time"
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
          />
          <p>태어난 시간을 모르면 비워두셔도 돼요</p>
        </div>
      </div>
      <div className="sajuedit_bottom">
        <BottomButton onClick={handleSave}>
          {isSaving ? "저장 중" : "저장하기"}
        </BottomButton>
        <p>사주 정보는 사주 매칭에만 사용돼요</p>
      </div>
    </div>
  );
};

export default SajuEdit;
