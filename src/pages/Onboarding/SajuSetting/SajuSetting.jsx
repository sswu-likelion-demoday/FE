import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { completeOnboarding } from "../../../api/onboarding";
import "./SajuSetting.scss";

const SajuSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAllowed, setIsAllowed] = useState(true);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");

  const isActive =
    !isAllowed || (birthDate.trim() !== "" && birthTime.trim() !== "");

  const saju = isAllowed
    ? {
        enabled: true,
        birthDate,
        calendarType: "SOLAR",
        birthTime,
      }
    : {
        enabled: false,
      };

  const handleComplete = async () => {
    if (!isActive || isSubmitting) return;

    const { mbti, socialStyle, interestIds, hobbyIds, friendTypeIds } =
      location.state ?? {};

    if (
      !mbti ||
      !socialStyle?.approach ||
      !socialStyle?.relationshipDepth ||
      !socialStyle?.friendshipPace ||
      !Array.isArray(interestIds) ||
      !Array.isArray(hobbyIds) ||
      !Array.isArray(friendTypeIds)
    ) {
      alert("온보딩 정보가 누락되었습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await completeOnboarding({
        mbti,
        socialStyle,
        interestIds,
        hobbyIds,
        friendTypeIds,
        saju,
      });

      navigate("/signup/onboarding-complete", { replace: true });
    } catch (error) {
      alert(error.message || "온보딩 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
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
                type="date"
                className="s_m_input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="s_m_3">
              <p>태어난 시간</p>
              <input
                type="time"
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
          disabled={!isActive || isSubmitting}
          onClick={handleComplete}
        >
          {isSubmitting ? "저장 중" : "설정 완료"}
        </button>
      </div>
    </div>
  );
};

export default SajuSetting;
