import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { completeOnboarding, saveSajuSettings } from "../../../api/onboarding";
import "./SajuSetting.scss";

const socialStyleMap = {
  1: "FIRST_APPROACH",
  2: "RESPOND_COMFORTABLY",
  3: "CONVERSATION_BASED",
  4: "ACTIVITY_BASED",
  5: "CASUAL_START",
  6: "SLOW_AND_DEEP",
};

const interestMap = {
  1: "ART_EXHIBITION",
  2: "MOVIE_DRAMA",
  3: "MUSIC_CONCERT",
  4: "TRAVEL",
  5: "FOOD_CAFE",
  6: "FASHION_BEAUTY",
  7: "BOOK_WRITING",
  8: "IT_TECH",
  9: "FINANCE",
  10: "ANIMAL",
  11: "GAME",
  12: "SPORTS",
  13: "COOKING_BAKING",
  14: "SELF_DEVELOPMENT",
  15: "CAREER",
};

const hobbyMap = {
  1: "CAFE",
  2: "RESTAURANT",
  3: "RUNNING",
  4: "READING",
  5: "TRAVEL",
  6: "GAME",
  7: "COOKING_BAKING",
  8: "DRAWING_CRAFT",
  9: "EXHIBITION",
  10: "MUSIC",
  11: "WALKING",
  12: "FITNESS",
  13: "BOARD_GAME",
  14: "PHOTOGRAPHY",
  15: "CONTENT_WATCHING",
};

const friendTypeMap = {
  1: "EASY_TO_TALK",
  2: "FUN_TO_BE_WITH",
  3: "EMPATHETIC",
  4: "MOTIVATING",
  5: "SHARED_INTEREST",
  6: "NEW_PERSPECTIVE",
  7: "LONG_TERM",
};

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
        matchingEnabled: true,
        calendarType: "SOLAR",
        birthDate,
        birthTime,
      }
    : {
        matchingEnabled: false,
      };

  const handleComplete = async () => {
    if (!isActive || isSubmitting) return;

    const {
      mbti,
      socialStyleSelectionIds,
      interestOptionIds,
      hobbyOptionIds,
      friendTypeIds,
    } = location.state ?? {};

    if (
      !mbti ||
      !Array.isArray(socialStyleSelectionIds) ||
      !Array.isArray(interestOptionIds) ||
      !Array.isArray(hobbyOptionIds) ||
      !Array.isArray(friendTypeIds) ||
      socialStyleSelectionIds.length < 1 ||
      socialStyleSelectionIds.length > 2 ||
      interestOptionIds.length < 3 ||
      interestOptionIds.length > 5 ||
      hobbyOptionIds.length < 3 ||
      hobbyOptionIds.length > 5 ||
      friendTypeIds.length < 1 ||
      friendTypeIds.length > 3
    ) {
      alert("온보딩 정보가 누락되었거나 올바르지 않습니다.");
      return;
    }

    const onboardingData = {
      mbti,
      socialStyles: socialStyleSelectionIds.map((id) => socialStyleMap[id]),
      interests: interestOptionIds.map((id) => interestMap[id]),
      hobbies: hobbyOptionIds.map((id) => hobbyMap[id]),
      friendTypes: friendTypeIds.map((id) => friendTypeMap[id]),
    };

    if (
      [
        ...onboardingData.socialStyles,
        ...onboardingData.interests,
        ...onboardingData.hobbies,
        ...onboardingData.friendTypes,
      ].some((value) => !value)
    ) {
      alert("일부 선택 항목의 매핑 정보가 누락되었습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await saveSajuSettings(saju);
      await completeOnboarding(onboardingData);

      navigate("/signup/onboarding-complete", {
        replace: true,
      });
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
