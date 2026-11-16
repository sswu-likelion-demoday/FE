import './PartnerProfile.scss';

import {
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';
import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';
import lock_icon from '../../../../assets/images/Chat/lock_icon.svg';
import lock_icon_2 from '../../../../assets/images/Chat/lock_icon_2.svg';
import lock_open from '../../../../assets/images/Chat/lock_open.svg';

import {
  getRelationshipStage,
} from '../../data/relationshipData';

const PartnerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentStage =
    location.state?.currentStage ?? 1;

  const completedStage =
    location.state?.completedStage ??
    Math.max(currentStage - 1, 0);

  const isRelationshipComplete =
    completedStage >= 4;

  const currentStageData =
    getRelationshipStage(currentStage);

  const isStageUnlocked = (stage) =>
    completedStage >= stage;

  const isProfileImageUnlocked =
    isStageUnlocked(3);

  const defaultSection =
    currentStage >= 4
      ? 'contact'
      : currentStage === 3
        ? 'basic'
        : currentStage === 2
          ? 'hobby'
          : 'interest';

  const [
    selectedSection,
    setSelectedSection,
  ] = useState(defaultSection);

  useEffect(() => {
    setSelectedSection(defaultSection);
  }, [defaultSection]);

  const handleSectionClick = (
    section
  ) => {
    setSelectedSection(section);
  };

  const handleBackToChat = () => {
    if (isRelationshipComplete) {
      navigate('/chat/1', {
        state: {
          relationshipComplete: true,
          completedStage: 4,
          currentStage: 4,
          stage: 4,
          quest: 4,
        },
      });

      return;
    }

    navigate('/chat/1', {
      state: {
        stage: currentStage,
        quest: 1,
      },
    });
  };

  return (
    <div className="page">
      <div className="partner_profile">
        <header className="partner_profile_header">
          <button
            type="button"
            className="partner_profile_back"
            onClick={handleBackToChat}
            aria-label="채팅방으로 돌아가기"
          >
            <img
              src={arrow_left}
              alt=""
            />
          </button>

          <h1 className="partner_profile_header_title">
            달빛여우님의 프로필
          </h1>
        </header>

        <main className="partner_profile_content">
          <div className="partner_profile_main">
            <div className="partner_profile_image_wrap">
              <img
                src={profile_purple}
                alt="달빛여우 프로필"
                className="partner_profile_image"
              />

              {!isProfileImageUnlocked && (
                <div className="partner_profile_lock">
                  <img
                    src={lock_icon}
                    alt=""
                  />
                </div>
              )}
            </div>

            <h2 className="partner_profile_name">
              달빛여우
            </h2>

            <span className="partner_profile_stage">
              {isRelationshipComplete
                ? '인연 완료'
                : currentStageData.stageLabel}
            </span>

            {!isProfileImageUnlocked && (
              <p className="partner_profile_guide">
                프로필 사진은 3단계
                ‘가까워지는 중’을 마치면 공개돼요
              </p>
            )}
          </div>

          {isStageUnlocked(1) ? (
            <section
              className={`partner_profile_card ${selectedSection === 'interest'
                  ? 'partner_profile_card_active'
                  : ''
                }`}
              onClick={() =>
                handleSectionClick('interest')
              }
            >
              <div className="partner_profile_card_header">
                <h3>관심사</h3>

                <span className="partner_profile_unlock">
                  <img src={lock_open} alt="" />
                  1단계 해금
                </span>
              </div>

              <div className="partner_profile_tags">
                <span>#러닝</span>
                <span>#카페투어</span>
                <span>#전시회</span>
                <span>#보드게임</span>
              </div>
            </section>
          ) : (
            <section className="partner_profile_locked">
              <div className="partner_profile_locked_header">
                <span>관심사 전체</span>
                <img src={lock_icon_2} alt="" />
              </div>

              <div className="partner_profile_skeleton">
                <div />
                <div />
              </div>

              <p>
                1단계 ‘첫 인사’를 마치면 열려요
              </p>
            </section>
          )}

          {isStageUnlocked(2) ? (
            <section
              className={`partner_profile_card ${selectedSection === 'hobby'
                  ? 'partner_profile_card_active'
                  : ''
                }`}
              onClick={() =>
                handleSectionClick('hobby')
              }
            >
              <div className="partner_profile_card_header">
                <h3>취미 · MBTI</h3>

                <span className="partner_profile_unlock">
                  <img src={lock_open} alt="" />
                  2단계 해금
                </span>
              </div>

              <div className="partner_profile_info_row">
                <span>취미</span>
                <strong>독서, 여행, 게임</strong>
              </div>

              <div className="partner_profile_info_row">
                <span>
                  함께하고 싶은 활동
                </span>
                <strong>클라이밍</strong>
              </div>

              <div className="partner_profile_info_row">
                <span>MBTI</span>
                <strong>INFJ</strong>
              </div>

              <div className="partner_profile_info_row">
                <span>만남 성향</span>
                <strong>
                  천천히 알아가는 편
                </strong>
              </div>
            </section>
          ) : (
            <section className="partner_profile_locked">
              <div className="partner_profile_locked_header">
                <span>
                  취미 · 함께하고 싶은 활동 · MBTI · 만남 성향
                </span>
                <img src={lock_icon_2} alt="" />
              </div>

              <div className="partner_profile_skeleton">
                <div />
                <div />
              </div>

              <p>
                2단계 ‘알아가는 중’을 마치면 열려요
              </p>
            </section>
          )}

          {isStageUnlocked(3) ? (
            <section
              className={`partner_profile_card ${selectedSection === 'basic'
                  ? 'partner_profile_card_active'
                  : ''
                }`}
              onClick={() =>
                handleSectionClick('basic')
              }
            >
              <div className="partner_profile_card_header">
                <h3>기본 정보</h3>

                <span className="partner_profile_unlock">
                  <img src={lock_open} alt="" />
                  3단계 해금
                </span>
              </div>

              <div className="partner_profile_info_row">
                <span>이름</span>
                <strong>공개된 이름</strong>
              </div>

              <div className="partner_profile_info_row">
                <span>학번</span>
                <strong>공개된 학번</strong>
              </div>

              <div className="partner_profile_info_row">
                <span>학과</span>
                <strong>공개된 학과</strong>
              </div>
            </section>
          ) : (
            <section className="partner_profile_locked">
              <div className="partner_profile_locked_header">
                <span>
                  이름 · 학번 · 학과 · 프로필 사진
                </span>
                <img src={lock_icon_2} alt="" />
              </div>

              <div className="partner_profile_skeleton">
                <div />
                <div />
              </div>

              <p>
                3단계 ‘가까워지는 중’을 마치면 열려요
              </p>
            </section>
          )}

          {isStageUnlocked(4) ? (
            <section
              className={`partner_profile_card ${selectedSection === 'contact'
                  ? 'partner_profile_card_active'
                  : ''
                }`}
              onClick={() =>
                handleSectionClick('contact')
              }
            >
              <div className="partner_profile_card_header">
                <h3>
                  외부 연락 수단
                </h3>

                <span className="partner_profile_unlock">
                  <img src={lock_open} alt="" />
                  4단계 해금
                </span>
              </div>

              <div className="partner_profile_info_row">
                <span>카카오톡 ID</span>
                <strong>
                  sujeong_0408
                </strong>
              </div>

              <div className="partner_profile_info_row">
                <span>Instagram</span>
                <strong>
                  @sujeong_0408
                </strong>
              </div>
            </section>
          ) : (
            <section className="partner_profile_locked">
              <div className="partner_profile_locked_header">
                <span>
                  외부 연락 수단
                </span>
                <img src={lock_icon_2} alt="" />
              </div>

              <div className="partner_profile_skeleton">
                <div />
                <div />
              </div>

              <p>
                4단계 ‘인연’을 마치면 열려요
              </p>
            </section>
          )}
        </main>

        <button
          type="button"
          className="partner_profile_return"
          onClick={handleBackToChat}
        >
          대화로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PartnerProfile;