import { useState } from "react";
import "./CategoryMatchResultPage.scss";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import matching_profile from "../../../assets/images/Matching/matching_profile.svg";
import category_profile2 from "../../../assets/images/Matching/category_profile2.svg";
import category_profile3 from "../../../assets/images/Matching/category_profile3.svg";
import copy_icon from "../../../assets/images/Chat/copy.svg";

const profileImages = [matching_profile, category_profile2, category_profile3];

// profiles: [{ id, image, nickname, department, studentId, mbti, kakaoId }]
const CategoryMatchResultPage = ({
  profiles = [],
  onOpenChat,
  onComplete,
}) => {
  // 현재 보고 있는 수정과 복사 안내 문구
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const currentIndex = Math.min(index, Math.max(0, profiles.length - 1));
  const profile = profiles[currentIndex];
  const profileImage = profile?.image || profileImages[currentIndex % profileImages.length];
  let imageClass = "custom";
  if (profileImage === matching_profile) imageClass = "purple";
  if (profileImage === category_profile2) imageClass = "blue";
  if (profileImage === category_profile3) imageClass = "pink";

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === profiles.length - 1;

  const handleMove = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= profiles.length) return;
    setIndex(nextIndex);
    setMessage("");
  };

  const handleOpenChat = () => {
    if (onOpenChat) onOpenChat(profile);
  };

  const handleCopy = async () => {
    const kakaoId = profile?.kakaoId;
    if (!kakaoId) return;

    let copied = false;
    try {
      await navigator.clipboard.writeText(kakaoId);
      copied = true;
    } catch {
      const previousFocus = document.activeElement;
      const input = document.createElement("textarea");
      input.value = kakaoId;
      input.readOnly = true;
      input.style.cssText = "position: fixed; top: 0; left: -9999px;";
      document.body.appendChild(input);

      try {
        input.select();
        input.setSelectionRange(0, input.value.length);
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      } finally {
        input.remove();
        previousFocus?.focus?.({ preventScroll: true });
      }
    }

    setMessage(copied
      ? "카카오톡 ID를 복사했어요"
      : "복사하지 못했어요. ID를 길게 눌러 복사해 주세요");
  };

  return (
    <section className="category_result" aria-label="카테고리 매칭 결과">
      {profile ? (
        <>
          <h2>서로의 연락처가<br />공개되었어요</h2>
          <p className="category_result_counter" aria-live="polite">{currentIndex + 1} / {profiles.length}</p>
          <div className="category_result_carousel">
            <button
              type="button"
              className="category_result_arrow previous"
              aria-label="이전 프로필"
              disabled={isFirst}
              onClick={() => handleMove(currentIndex - 1)}
            >
              <svg viewBox="0 0 16 44" aria-hidden="true"><path d="m12 2-8 20 8 20" /></svg>
            </button>
            <article className="category_result_card" aria-label={`${profile.nickname} 프로필`}>
              <div className={`category_result_avatar ${imageClass}`}>
                <img className="category_result_image" src={profileImage} alt="" />
              </div>
              <h3>{profile.nickname}</h3>
              <p className="category_result_info category_result_student">
                <span>{profile.department}</span>
                <span>{profile.studentId}학번</span>
              </p>
              <p className="category_result_info">{profile.mbti}</p>
              <div className="category_result_contact">
                <span>카카오톡 ID</span>
                <div>
                  <p>{profile.kakaoId || "등록된 ID가 없어요"}</p>
                  <button
                    type="button"
                    aria-label={`${profile.nickname} 카카오톡 ID 복사`}
                    onClick={handleCopy}
                    disabled={!profile.kakaoId}
                  >
                    <img src={copy_icon} alt="" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="category_result_open"
                onClick={handleOpenChat}
                disabled={!profile.kakaoId || !onOpenChat}
              >
                카카오톡 열기
              </button>
            </article>
            <button
              type="button"
              className="category_result_arrow next"
              aria-label="다음 프로필"
              disabled={isLast}
              onClick={() => handleMove(currentIndex + 1)}
            >
              <svg viewBox="0 0 16 44" aria-hidden="true"><path d="m4 2 8 20-8 20" /></svg>
            </button>
          </div>
          <p className="category_result_guide">카카오톡에서 자유롭게<br />이야기를 나눠보세요</p>
          <p className="category_result_feedback" role="status">{message}</p>
          {isLast && (
            <div className="category_result_complete">
              <BottomButton onClick={onComplete}>확인 완료</BottomButton>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="category_result_empty">아직 확인할 매칭 결과가 없어요</p>
          <div className="category_result_complete">
            <BottomButton onClick={onComplete}>확인</BottomButton>
          </div>
        </>
      )}
    </section>
  );
};

export default CategoryMatchResultPage;
