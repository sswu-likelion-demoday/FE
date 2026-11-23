import './PartnerProfile.scss';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getPartnerProfile,
} from '../../../../api/relationship';

import {
  getChatRoomDetail,
} from '../../../../api/chat';

import {
  useChatSocket,
} from '../../ChatSocketLayout';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';
import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';
import lock_icon from '../../../../assets/images/Chat/lock_icon.svg';
import lock_icon_2 from '../../../../assets/images/Chat/lock_icon_2.svg';
import lock_open from '../../../../assets/images/Chat/lock_open.svg';

import {
  getRelationshipStage,
} from '../../data/relationshipData';

const PartnerProfile = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { chatId } =
    useParams();

  const {
    latestUnlockEvent,
    reconnectCount,
  } = useChatSocket();

  const [
    partnerProfile,
    setPartnerProfile,
  ] = useState(null);

  const routeRelationshipId = location.state?.relationshipId;
  const resolvedRelationshipIdRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);

  const [
    selectedSection,
    setSelectedSection,
  ] = useState(
    'interest'
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  useLayoutEffect(() => {
    let ignore = false;

    const fetchPartnerProfile = async () => {
      if (ignore) {
        return;
      }

      setErrorMessage('');

      try {
        let relationshipId = routeRelationshipId ?? resolvedRelationshipIdRef.current;
        if (!relationshipId) {
          const chatRoom = await getChatRoomDetail(chatId);
          if (ignore) {
            return;
          }
          relationshipId = chatRoom.relationshipId;
          resolvedRelationshipIdRef.current = relationshipId;
        }

        if (!relationshipId) {
          throw new Error('관계 정보를 확인할 수 없습니다.');
        }

        const data = await getPartnerProfile(relationshipId);
        if (!ignore) {
          setPartnerProfile(data);
        }
      } catch (error) {
        if (!ignore) {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.code === 'RELATIONSHIP_ACCESS_DENIED' ||
            error.code === 'AUTH_UNAUTHORIZED'
          ) {
            setPartnerProfile(null);
          }
          setErrorMessage(error.message || '상대 프로필을 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    // StrictMode의 첫 setup이 정리되면 요청을 시작하지 않는다.
    Promise.resolve().then(fetchPartnerProfile);

    return () => {
      ignore = true;
    };
  }, [chatId, routeRelationshipId, latestUnlockEvent, reconnectCount, retryCount]);

  /*
   * 현재 API 상태
   */
  const currentStage =
    partnerProfile
      ?.currentStage?.stage ??
    1;

  const currentStageData =
    getRelationshipStage(
      currentStage
    );

  const isRelationshipComplete =
    partnerProfile
      ?.relationshipStatus ===
    'COMPLETED';

  /*
   * 각 정보는 stage 숫자를
   * 프론트에서 추측하지 않고
   * 서버의 unlocked 값으로 판단.
   */
  const isInterestUnlocked =
    partnerProfile
      ?.interests?.unlocked ===
    true;

  const isHobbyUnlocked =
    partnerProfile
      ?.hobbies?.unlocked ===
    true ||
    partnerProfile
      ?.mbti?.unlocked ===
    true;

  const isBasicUnlocked =
    partnerProfile
      ?.name?.unlocked ===
    true ||
    partnerProfile
      ?.studentNumber
      ?.unlocked === true ||
    partnerProfile
      ?.department?.unlocked ===
    true ||
    partnerProfile
      ?.profileImage
      ?.unlocked === true;

  const isContactUnlocked =
    partnerProfile
      ?.contact?.unlocked ===
    true;

  const isProfileImageUnlocked =
    partnerProfile
      ?.profileImage
      ?.unlocked === true;

  /*
   * 새 프로필 데이터를 받은 뒤
   * 가장 최근에 해금된 영역을
   * 기본 선택한다.
   */
  useEffect(() => {
    if (
      isContactUnlocked
    ) {
      setSelectedSection(
        'contact'
      );

      return;
    }

    if (
      isBasicUnlocked
    ) {
      setSelectedSection(
        'basic'
      );

      return;
    }

    if (
      isHobbyUnlocked
    ) {
      setSelectedSection(
        'hobby'
      );

      return;
    }

    setSelectedSection(
      'interest'
    );
  }, [
    isContactUnlocked,
    isBasicUnlocked,
    isHobbyUnlocked,
  ]);

  const handleSectionClick = (
    section
  ) => {
    setSelectedSection(
      section
    );
  };

  const handleBackToChat =
    () => {
      navigate(
        `/chat/${chatId}`
      );
    };

  if (isLoading) {
    return (
      <div className="page">
        <div className="partner_profile">
          <p>
            상대 프로필을
            불러오는 중이에요.
          </p>
        </div>
      </div>
    );
  }

  if (!partnerProfile) {
    return (
      <div className="page">
        <div className="partner_profile">
          <p>
            {errorMessage ||
              '상대 프로필을 불러오지 못했습니다.'}
          </p>

          <button
            type="button"
            onClick={
              handleBackToChat
            }
          >
            채팅방으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const profileImageSrc =
    isProfileImageUnlocked &&
      partnerProfile
        .profileImage?.value
      ? partnerProfile
        .profileImage.value
      : profile_purple;

  return (
    <div className="page">
      <div className="partner_profile">
        <header className="partner_profile_header">
          <button
            type="button"
            className="partner_profile_back"
            onClick={
              handleBackToChat
            }
            aria-label="채팅방으로 돌아가기"
          >
            <img
              src={arrow_left}
              alt=""
            />
          </button>

          <h1 className="partner_profile_header_title">
            {partnerProfile.nickname}
            님의 프로필
          </h1>
        </header>

        <main className="partner_profile_content">
          {errorMessage && (
            <div role="status">
              <p>프로필을 갱신하지 못했습니다. {errorMessage}</p>
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
              >
                다시 시도
              </button>
            </div>
          )}
          <div className="partner_profile_main">
            <div className="partner_profile_image_wrap">
              <img
                src={
                  profileImageSrc
                }
                alt={`${partnerProfile.nickname} 프로필`}
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
              {
                partnerProfile.nickname
              }
            </h2>

            <span className="partner_profile_stage">
              {isRelationshipComplete
                ? '인연 완료'
                : currentStageData.stageLabel}
            </span>

            {!isProfileImageUnlocked && (
              <p className="partner_profile_guide">
                프로필 사진은 3단계
                ‘가까워지는 중’을
                마치면 공개돼요
              </p>
            )}
          </div>

          {/* 1단계 - 관심사 */}
          {isInterestUnlocked ? (
            <section
              className={`partner_profile_card ${selectedSection ===
                  'interest'
                  ? 'partner_profile_card_active'
                  : ''
                }`}
              onClick={() =>
                handleSectionClick(
                  'interest'
                )
              }
            >
              <div className="partner_profile_card_header">
                <h3>
                  관심사
                </h3>

                <span className="partner_profile_unlock">
                  <img
                    src={
                      lock_open
                    }
                    alt=""
                  />
                  1단계 해금
                </span>
              </div>

              <div className="partner_profile_tags">
                {(
                  partnerProfile
                    .interests
                    ?.values ?? []
                ).map(
                  (
                    interest
                  ) => (
                    <span
                      key={
                        interest
                      }
                    >
                      #
                      {
                        interest
                      }
                    </span>
                  )
                )}
              </div>
            </section>
          ) : (
            <section className="partner_profile_locked">
              <div className="partner_profile_locked_header">
                <span>
                  관심사 전체
                </span>

                <img
                  src={
                    lock_icon_2
                  }
                  alt=""
                />
              </div>

              <div className="partner_profile_skeleton">
                <div />
                <div />
              </div>

              <p>
                1단계 ‘첫 인사’를
                마치면 열려요
              </p>
            </section>
          )}

          {/* 2단계 - 취미 / MBTI */}
          {isHobbyUnlocked ? (
            <section
              className={`partner_profile_card ${selectedSection ===
                  'hobby'
                  ? 'partner_profile_card_active'
                  : ''
                }`}
              onClick={() =>
                handleSectionClick(
                  'hobby'
                )
              }
            >
              <div className="partner_profile_card_header">
                <h3>
                  취미 · MBTI
                </h3>

                <span className="partner_profile_unlock">
                  <img
                    src={
                      lock_open
                    }
                    alt=""
                  />
                  2단계 해금
                </span>
              </div>

              {partnerProfile
                .hobbies
                ?.unlocked && (
                  <div className="partner_profile_info_row">
                    <span>
                      취미
                    </span>

                    <strong>
                      {(
                        partnerProfile
                          .hobbies
                          ?.values ??
                        []
                      ).join(
                        ', '
                      ) ||
                        '-'}
                    </strong>
                  </div>
                )}

              {partnerProfile
                .mbti
                ?.unlocked && (
                  <div className="partner_profile_info_row">
                    <span>
                      MBTI
                    </span>

                    <strong>
                      {partnerProfile
                        .mbti
                        ?.value ||
                        '-'}
                    </strong>
                  </div>
                )}
            </section>
          ) : (
            <section className="partner_profile_locked">
              <div className="partner_profile_locked_header">
                <span>
                  취미 · MBTI
                </span>

                <img
                  src={
                    lock_icon_2
                  }
                  alt=""
                />
              </div>

              <div className="partner_profile_skeleton">
                <div />
                <div />
              </div>

              <p>
                2단계 ‘알아가는 중’을
                마치면 열려요
              </p>
            </section>
          )}

          {/* 3단계 - 기본 정보 */}
          {isBasicUnlocked ? (
            <section
              className={`partner_profile_card ${selectedSection ===
                  'basic'
                  ? 'partner_profile_card_active'
                  : ''
                }`}
              onClick={() =>
                handleSectionClick(
                  'basic'
                )
              }
            >
              <div className="partner_profile_card_header">
                <h3>
                  기본 정보
                </h3>

                <span className="partner_profile_unlock">
                  <img
                    src={
                      lock_open
                    }
                    alt=""
                  />
                  3단계 해금
                </span>
              </div>

              {partnerProfile
                .name?.unlocked && (
                  <div className="partner_profile_info_row">
                    <span>
                      이름
                    </span>

                    <strong>
                      {partnerProfile
                        .name
                        ?.value ||
                        '-'}
                    </strong>
                  </div>
                )}

              {partnerProfile
                .studentNumber
                ?.unlocked && (
                  <div className="partner_profile_info_row">
                    <span>
                      학번
                    </span>

                    <strong>
                      {partnerProfile
                        .studentNumber
                        ?.value ||
                        '-'}
                    </strong>
                  </div>
                )}

              {partnerProfile
                .department
                ?.unlocked && (
                  <div className="partner_profile_info_row">
                    <span>
                      학과
                    </span>

                    <strong>
                      {partnerProfile
                        .department
                        ?.value ||
                        '-'}
                    </strong>
                  </div>
                )}
            </section>
          ) : (
            <section className="partner_profile_locked">
              <div className="partner_profile_locked_header">
                <span>
                  이름 · 학번 · 학과 ·
                  프로필 사진
                </span>

                <img
                  src={
                    lock_icon_2
                  }
                  alt=""
                />
              </div>

              <div className="partner_profile_skeleton">
                <div />
                <div />
              </div>

              <p>
                3단계 ‘가까워지는 중’을
                마치면 열려요
              </p>
            </section>
          )}

          {/* 4단계 - 외부 연락 수단 */}
          {isContactUnlocked ? (
            <section
              className={`partner_profile_card ${selectedSection ===
                  'contact'
                  ? 'partner_profile_card_active'
                  : ''
                }`}
              onClick={() =>
                handleSectionClick(
                  'contact'
                )
              }
            >
              <div className="partner_profile_card_header">
                <h3>
                  외부 연락 수단
                </h3>

                <span className="partner_profile_unlock">
                  <img
                    src={
                      lock_open
                    }
                    alt=""
                  />
                  4단계 해금
                </span>
              </div>

              <div className="partner_profile_info_row">
                <span>
                  연락 수단
                </span>

                <strong>
                  {partnerProfile
                    .contact
                    ?.value ||
                    '-'}
                </strong>
              </div>
            </section>
          ) : (
            <section className="partner_profile_locked">
              <div className="partner_profile_locked_header">
                <span>
                  외부 연락 수단
                </span>

                <img
                  src={
                    lock_icon_2
                  }
                  alt=""
                />
              </div>

              <div className="partner_profile_skeleton">
                <div />
                <div />
              </div>

              <p>
                4단계 ‘인연’을
                마치면 열려요
              </p>
            </section>
          )}
        </main>

        <button
          type="button"
          className="partner_profile_return"
          onClick={
            handleBackToChat
          }
        >
          대화로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PartnerProfile;