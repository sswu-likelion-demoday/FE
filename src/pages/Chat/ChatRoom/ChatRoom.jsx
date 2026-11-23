import './ChatRoom.scss';

import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { getChatRoomDetail } from '../../../api/chat';

import ChatHeader from '../components/ChatHeader/ChatHeader';
import MessageBubble from '../components/MessageBubble/MessageBubble';
import ChatInput from '../components/ChatInput/ChatInput';
import QuestBanner from '../components/QuestBanner/QuestBanner';
import QuestCard from '../components/QuestCard/QuestCard';
import QuestCompleteNotice from '../components/QuestCompleteNotice/QuestCompleteNotice';
import StageCompleteModal from '../components/StageCompleteModal/StageCompleteModal';
import ChatMenu from '../components/ChatMenu/ChatMenu';
import ChatModal from '../components/ChatModal/ChatModal';

import {
  getRelationshipStage,
  getQuest,
} from '../data/relationshipData';

import quest_orb from '../../../assets/images/Chat/quest_orb.svg';

const ChatRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();

  const numericChatId = Number(chatId);

  const [
    chatRoomDetail,
    setChatRoomDetail,
  ] = useState(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [showMenu, setShowMenu] =
    useState(false);

  const [modalType, setModalType] =
    useState(null);

  const [
    showQuestCard,
    setShowQuestCard,
  ] = useState(false);

  /*
   * 첫 만남 인증 직후에만
   * 외부 연락 수단 해금 모달 표시
   */
  const [
    showUnlockModal,
    setShowUnlockModal,
  ] = useState(
    location.state?.showUnlockModal === true
  );

  /*
   * 채팅방 상세 조회
   */
  useEffect(() => {
    const fetchChatRoomDetail =
      async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');

          const data =
            await getChatRoomDetail(
              chatId
            );

          setChatRoomDetail(data);

          if (
            data.relationshipStatus ===
            'ACTIVE' &&
            data.currentQuest
          ) {
            setShowQuestCard(true);
          } else {
            setShowQuestCard(false);
          }
        } catch (error) {
          setErrorMessage(
            error.message ||
            '채팅방 정보를 불러오지 못했습니다.'
          );
        } finally {
          setIsLoading(false);
        }
      };

    fetchChatRoomDetail();
  }, [chatId]);

  /*
   * 상세 API 기준 상태
   */
  const partner =
    chatRoomDetail?.partner ?? {};

  const relationshipId =
    chatRoomDetail?.relationshipId;

  const relationshipStatus =
    chatRoomDetail?.relationshipStatus;

  const isRelationshipComplete =
    relationshipStatus ===
    'COMPLETED';

  /*
   * ENDED 관계는 상세 조회 API에서
   * 409로 처리되므로 일반적으로
   * 여기까지 들어오지 않음.
   *
   * 기존 화면 이동 state는
   * 퍼블리싱 테스트 호환용으로만 유지.
   */
  const isRelationshipEnded =
    location.state?.relationshipEnded ===
    true;

  const writable =
    chatRoomDetail?.writable === true;

  const apiCurrentStage =
    chatRoomDetail?.currentStage;

  const questProgress =
    chatRoomDetail?.questProgress;

  const apiCurrentQuest =
    chatRoomDetail?.currentQuest;

  /*
   * API의 questProgress.completed는
   * 현재 단계에서 완료한 퀘스트 수.
   *
   * 따라서 현재 활성 퀘스트 번호는
   * completed + 1
   */
  const currentStage =
    apiCurrentStage?.stage ??
    (isRelationshipComplete ? 4 : 1);

  const currentQuestNumber =
    questProgress
      ? Math.min(
        questProgress.completed + 1,
        questProgress.total
      )
      : isRelationshipComplete
        ? 4
        : 1;

  const currentStageData =
    getRelationshipStage(
      currentStage
    );

  /*
   * relationshipData는
   * 화면 이동 경로/guide 등
   * 프론트 표시용 보조 데이터로만 사용.
   *
   * 진행 상태의 원본은 API.
   */
  const localCurrentQuest =
    !isRelationshipComplete
      ? getQuest(
        currentStage,
        currentQuestNumber
      )
      : null;

  const previousQuest =
    !isRelationshipComplete &&
      currentQuestNumber > 1
      ? getQuest(
        currentStage,
        currentQuestNumber - 1
      )
      : null;

  /*
   * 메시지 내역은 다음 API 연동에서 교체.
   */
  const messages = [
    {
      id: 1,
      type: 'other',
      message:
        '주말엔 보통 한강에서 러닝해요! 반포 쪽이요',
      time: '오후 8:07',
    },
    {
      id: 2,
      type: 'mine',
      message:
        '저 성수 쪽 카페 가보고 싶었어요!',
      time: '오후 8:09',
    },
    {
      id: 3,
      type: 'other',
      message:
        '오 거기 저도 가보고 싶었는데!',
      time: '오후 8:11',
    },
    {
      id: 4,
      type: 'mine',
      message:
        '저는 같이 클라이밍 해보고 싶어요!',
      time: '오후 8:15',
    },
  ];

  const getOrdinal = (
    questNumber
  ) => {
    const ordinals = {
      1: '첫 번째',
      2: '두 번째',
      3: '세 번째',
      4: '네 번째',
    };

    return ordinals[questNumber];
  };

  /*
   * relationshipData에 남아 있는
   * /chat/1 경로를 현재 chatId로 변환.
   */
  const getCurrentQuestPath = () => {
    if (!localCurrentQuest?.path) {
      return null;
    }

    return localCurrentQuest.path.replace(
      '/chat/1',
      `/chat/${chatId}`
    );
  };

  const getQuestCardData = () => {
    if (
      !apiCurrentQuest ||
      !localCurrentQuest
    ) {
      return null;
    }

    if (
      apiCurrentQuest.type ===
      'AI_QUIZ'
    ) {
      return {
        label:
          'AI 퀴즈가 도착했어요',
        title:
          apiCurrentQuest.title,
        description: `대화를 바탕으로 만든 ${partner.nickname ?? '상대방'}님 퀴즈예요.`,
        subDescription: `${currentStage}단계의 마지막 퀘스트예요!`,
        primaryText: '퀴즈 풀기',
        secondaryText: '나중에',
      };
    }

    /*
     * 현재 퍼블리싱의
     * 4단계 마지막 인증 퀘스트 판별.
     */
    if (
      localCurrentQuest.type ===
      'VERIFICATION'
    ) {
      return {
        label:
          '새 퀘스트가 열렸어요',
        title:
          apiCurrentQuest.title,
        description:
          '실제로 만났다면 첫 만남을 인증해보세요.',
        subDescription: `${currentStage}단계의 마지막 퀘스트예요!`,
        primaryText:
          '인증하러 가기',
        secondaryText: '나중에',
      };
    }

    return {
      label:
        '새 퀘스트가 열렸어요',
      title:
        apiCurrentQuest.title,
      description:
        localCurrentQuest.guide
          ? `채팅으로 ${localCurrentQuest.guide}.`
          : '채팅을 통해 퀘스트를 진행해보세요.',
      subDescription: `${currentStage}단계의 ${getOrdinal(
        currentQuestNumber
      )} 퀘스트예요!`,
      primaryText:
        '퀘스트 보기',
      secondaryText: '나중에',
    };
  };

  const questCardData =
    getQuestCardData();

  const handleQuestPrimaryClick =
    () => {
      /*
       * AI 퀴즈 / 인증처럼
       * 별도 화면이 존재하는 퀘스트만 이동.
       */
      const questPath =
        getCurrentQuestPath();

      if (questPath) {
        navigate(questPath, {
          state: {
            relationshipId,
            relationshipQuestId:
              apiCurrentQuest?.relationshipQuestId,
            stage: currentStage,
            quest:
              currentQuestNumber,
          },
        });

        return;
      }

      /*
       * 일반 채팅 퀘스트는
       * 클릭했다고 완료시키지 않음.
       *
       * 완료 여부는 백엔드가
       * 메시지를 분석해서 결정.
       */
      setShowQuestCard(false);
    };

  const handleRelationshipClick =
    () => {
      navigate(
        `/chat/${chatId}/relationship`,
        {
          state: {
            relationshipId,
            stage: currentStage,
            quest:
              currentQuestNumber,
            relationshipComplete:
              isRelationshipComplete,
            relationshipEnded:
              isRelationshipEnded,
          },
        }
      );
    };

  const handleBlock = () => {
    setShowMenu(false);
    setModalType(
      'blockConfirm'
    );
  };

  const handleLeave = () => {
    setShowMenu(false);
    setModalType(
      'leaveConfirm'
    );
  };

  const handleBlockConfirm = () => {
    /*
     * 차단 API는 이후 별도 연동.
     */
    setModalType(
      'blockDone'
    );
  };

  const handleBlockDone = () => {
    setModalType(null);

    /*
     * 차단 API 연동 전
     * 기존 퍼블리싱 동작 유지.
     */
    navigate('/chat', {
      state: {
        blockedChatId:
          numericChatId,
      },
    });
  };

  const handleLeaveConfirm =
    () => {
      setModalType(null);

      /*
       * 관계 종료 API 연동 전
       * 기존 퍼블리싱 동작 유지.
       */
      navigate('/chat', {
        state: {
          endedChatId:
            numericChatId,
        },
      });
    };

  if (isLoading) {
    return (
      <div className="page">
        <div className="chat_room">
          <p>
            채팅방 정보를 불러오는
            중이에요.
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page">
        <div className="chat_room">
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={() =>
              navigate('/chat')
            }
          >
            채팅 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="chat_room">
        <ChatHeader
          onProfileClick={() =>
            setShowMenu(true)
          }
          currentStage={
            currentStage
          }
          currentQuestNumber={
            currentQuestNumber
          }
          isRelationshipComplete={
            isRelationshipComplete
          }
          isRelationshipEnded={
            isRelationshipEnded
          }
          partnerName={
            partner.nickname ??
            '상대방'
          }
          partnerProfileImage={
            partner.profileImageUrl
          }
          partnerProfileImageUnlocked={
            partner.profileImageUnlocked ??
            false
          }
        />

        {isRelationshipComplete ? (
          <div className="relationship_complete_banner">
            <div className="relationship_complete_banner_title">
              <img
                src={quest_orb}
                alt=""
                className="relationship_complete_banner_orb"
              />

              <strong>
                인연이 완성되었어요!
              </strong>
            </div>

            <p className="relationship_complete_banner_description">
              4단계의 모든 퀘스트를
              완료했어요.
              <br />
              이제 이 채팅방은 읽기
              전용으로 보관돼요.
            </p>

            <button
              type="button"
              className="relationship_complete_banner_link"
              onClick={() =>
                navigate(
                  `/chat/${chatId}/profile`,
                  {
                    state: {
                      relationshipId,
                      completedStage:
                        4,
                      currentStage: 4,
                      currentQuestNumber:
                        4,
                    },
                  }
                )
              }
            >
              상대 프로필 보기 &gt;
            </button>
          </div>
        ) : isRelationshipEnded ? (
          <div className="relationship_end_banner">
            <strong className="relationship_end_banner_title">
              이번 수정과의 인연은
              여기서 마무리되었어요.
            </strong>

            <p className="relationship_end_banner_description">
              지금까지 나눈 대화는
              읽기모드로 확인할 수
              있어요.
            </p>
          </div>
        ) : (
          <QuestBanner
            stage={
              apiCurrentStage?.stage
            }
            stageName={
              apiCurrentStage?.name
            }
            currentQuest={
              currentQuestNumber
            }
            totalQuest={
              questProgress?.total ??
              currentStageData.quests
                .length
            }
            title={
              apiCurrentQuest?.title ??
              ''
            }
            questLabel={
              showQuestCard
                ? '새 퀘스트 · 진행 중'
                : '진행 중 퀘스트'
            }
            unlockText={
              chatRoomDetail
                ?.unlockGuideMessage ??
              ''
            }
            onProgressClick={
              handleRelationshipClick
            }
          />
        )}

        <div className="chat_room_body">
          <main
            className={`chat_room_messages ${isRelationshipComplete ||
              isRelationshipEnded
              ? 'chat_room_messages_complete'
              : ''
              }`}
          >
            {messages.map(
              (message) => (
                <MessageBubble
                  key={message.id}
                  type={message.type}
                  message={
                    message.message
                  }
                  time={message.time}
                />
              )
            )}

            {isRelationshipComplete && (
              <QuestCompleteNotice
                title="첫 만남 상호 인증하기"
              />
            )}

            {!isRelationshipComplete &&
              !isRelationshipEnded &&
              previousQuest && (
                <QuestCompleteNotice
                  title={
                    previousQuest.title
                  }
                />
              )}
          </main>
        </div>

        {!isRelationshipComplete &&
          !isRelationshipEnded &&
          showQuestCard &&
          questCardData && (
            <QuestCard
              label={
                questCardData.label
              }
              title={
                questCardData.title
              }
              description={
                questCardData.description
              }
              subDescription={
                questCardData.subDescription
              }
              primaryText={
                questCardData.primaryText
              }
              secondaryText={
                questCardData.secondaryText
              }
              onPrimaryClick={
                handleQuestPrimaryClick
              }
              onSecondaryClick={() =>
                setShowQuestCard(false)
              }
            />
          )}

        {writable &&
          !isRelationshipComplete &&
          !isRelationshipEnded && (
            <ChatInput />
          )}

        {showUnlockModal && (
          <StageCompleteModal
            stage={4}
            title="외부 연락 수단이 해금됐어요!"
            reward="+10 수정구"
            infoLabel="카카오톡 ID"
            infoValue="sujeong_0408"
            continueButtonText="채팅으로 돌아가기"
            onProfile={() =>
              navigate(
                `/chat/${chatId}/profile`,
                {
                  state: {
                    relationshipId,
                    completedStage:
                      4,
                    currentStage: 4,
                    currentQuestNumber:
                      4,
                  },
                }
              )
            }
            onContinue={() =>
              setShowUnlockModal(
                false
              )
            }
          />
        )}

        {showMenu && (
          <ChatMenu
            onClose={() =>
              setShowMenu(false)
            }
            onProfile={() =>
              navigate(
                `/chat/${chatId}/profile`,
                {
                  state: {
                    relationshipId,
                    completedStage:
                      isRelationshipComplete
                        ? 4
                        : Math.max(
                          currentStage -
                          1,
                          0
                        ),
                    currentStage:
                      isRelationshipComplete
                        ? 4
                        : currentStage,
                    currentQuestNumber:
                      isRelationshipComplete
                        ? 4
                        : currentQuestNumber,
                    relationshipEnded:
                      isRelationshipEnded,
                  },
                }
              )
            }
            onBlock={
              handleBlock
            }
            onLeave={
              handleLeave
            }
            currentStage={
              currentStage
            }
            isRelationshipComplete={
              isRelationshipComplete
            }
          />
        )}

        {modalType ===
          'blockConfirm' && (
            <ChatModal
              type="blockConfirm"
              onClose={() =>
                setModalType(null)
              }
              onConfirm={
                handleBlockConfirm
              }
            />
          )}

        {modalType ===
          'blockDone' && (
            <ChatModal
              type="blockDone"
              onClose={
                handleBlockDone
              }
            />
          )}

        {modalType ===
          'leaveConfirm' && (
            <ChatModal
              type="leaveConfirm"
              onClose={() =>
                setModalType(null)
              }
              onConfirm={
                handleLeaveConfirm
              }
            />
          )}
      </div>
    </div>
  );
};

export default ChatRoom;