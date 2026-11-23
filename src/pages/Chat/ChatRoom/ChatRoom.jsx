import './ChatRoom.scss';

import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getChatRoomDetail,
  getChatMessages,
} from '../../../api/chat';

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
    messages,
    setMessages,
  ] = useState([]);

  const [
    nextCursor,
    setNextCursor,
  ] = useState(null);

  const [
    hasNextMessages,
    setHasNextMessages,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isMessagesLoading,
    setIsMessagesLoading,
  ] = useState(false);

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
   * 메시지 시간 표시
   */
  const formatMessageTime = (
    dateString
  ) => {
    if (!dateString) {
      return '';
    }

    const date = new Date(
      dateString
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    return date.toLocaleTimeString(
      'ko-KR',
      {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }
    );
  };

  /*
   * 채팅방 상세 + 최초 메시지 조회
   */
  useEffect(() => {
    const fetchChatRoom =
      async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');

          const [
            detailData,
            messageData,
          ] = await Promise.all([
            getChatRoomDetail(
              chatId
            ),
            getChatMessages(
              chatId
            ),
          ]);

          setChatRoomDetail(
            detailData
          );

          setMessages(
            messageData.messages ??
            []
          );

          setNextCursor(
            messageData.nextCursor ??
            null
          );

          setHasNextMessages(
            messageData.hasNext ??
            false
          );

          if (
            detailData.relationshipStatus ===
            'ACTIVE' &&
            detailData.currentQuest
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

    fetchChatRoom();
  }, [chatId]);

  /*
   * 이전 메시지 더 불러오기
   *
   * 추후 스크롤 이벤트에 연결 가능.
   * 현재는 함수만 준비.
   */
  const loadPreviousMessages =
    async () => {
      if (
        !hasNextMessages ||
        !nextCursor ||
        isMessagesLoading
      ) {
        return;
      }

      try {
        setIsMessagesLoading(
          true
        );

        const data =
          await getChatMessages(
            chatId,
            nextCursor
          );

        setMessages(
          (previousMessages) => [
            ...(data.messages ??
              []),
            ...previousMessages,
          ]
        );

        setNextCursor(
          data.nextCursor ??
          null
        );

        setHasNextMessages(
          data.hasNext ?? false
        );
      } catch (error) {
        console.error(
          '이전 메시지 조회 실패:',
          error
        );
      } finally {
        setIsMessagesLoading(
          false
        );
      }
    };

  /*
   * 상세 API 기준 상태
   */
  const partner =
    chatRoomDetail?.partner ?? {};

  const relationshipId =
    chatRoomDetail?.relationshipId;

  const relationshipStatus =
    chatRoomDetail
      ?.relationshipStatus;

  const isRelationshipComplete =
    relationshipStatus ===
    'COMPLETED';

  /*
   * ENDED 관계는 상세 조회 API에서
   * 오류로 처리되므로 일반적으로
   * 여기까지 들어오지 않음.
   *
   * 기존 화면 이동 state는
   * 퍼블리싱 테스트 호환용으로만 유지.
   */
  const isRelationshipEnded =
    location.state
      ?.relationshipEnded ===
    true;

  const writable =
    chatRoomDetail?.writable ===
    true;

  const apiCurrentStage =
    chatRoomDetail?.currentStage;

  const questProgress =
    chatRoomDetail?.questProgress;

  const apiCurrentQuest =
    chatRoomDetail?.currentQuest;

  /*
   * 현재 단계 / 퀘스트
   */
  const currentStage =
    apiCurrentStage?.stage ??
    (isRelationshipComplete
      ? 4
      : 1);

  const currentQuestNumber =
    questProgress
      ? Math.min(
        questProgress.completed +
        1,
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
   * 프론트의 relationshipData는
   * 화면 이동 경로와 가이드 표시용.
   */
  const localCurrentQuest =
    !isRelationshipComplete
      ? getQuest(
        currentStage,
        currentQuestNumber
      )
      : null;

  const getOrdinal = (
    questNumber
  ) => {
    const ordinals = {
      1: '첫 번째',
      2: '두 번째',
      3: '세 번째',
      4: '네 번째',
    };

    return ordinals[
      questNumber
    ];
  };

  const getCurrentQuestPath =
    () => {
      if (
        !localCurrentQuest?.path
      ) {
        return null;
      }

      return localCurrentQuest.path.replace(
        '/chat/1',
        `/chat/${chatId}`
      );
    };

  const getQuestCardData =
    () => {
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
          description: `대화를 바탕으로 만든 ${partner.nickname ??
            '상대방'
            }님 퀴즈예요.`,
          subDescription: `${currentStage}단계의 마지막 퀘스트예요!`,
          primaryText:
            '퀴즈 풀기',
          secondaryText:
            '나중에',
        };
      }

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
          secondaryText:
            '나중에',
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
        secondaryText:
          '나중에',
      };
    };

  const questCardData =
    getQuestCardData();

  const handleQuestPrimaryClick =
    () => {
      const questPath =
        getCurrentQuestPath();

      if (questPath) {
        navigate(questPath, {
          state: {
            relationshipId,
            relationshipQuestId:
              apiCurrentQuest
                ?.relationshipQuestId,
            stage: currentStage,
            quest:
              currentQuestNumber,
          },
        });

        return;
      }

      /*
       * 일반 채팅 퀘스트는
       * 버튼 클릭으로 완료시키지 않음.
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

  const handleBlockConfirm =
    () => {
      /*
       * 차단 API는 이후 별도 연동.
       */
      setModalType(
        'blockDone'
      );
    };

  const handleBlockDone = () => {
    setModalType(null);

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
          <p>
            {errorMessage}
          </p>

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
              상대 프로필 보기
              &gt;
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
              currentStageData
                .quests.length
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
            {hasNextMessages && (
              <button
                type="button"
                onClick={
                  loadPreviousMessages
                }
                disabled={
                  isMessagesLoading
                }
              >
                {isMessagesLoading
                  ? '이전 메시지 불러오는 중...'
                  : '이전 메시지 보기'}
              </button>
            )}

            {messages.map(
              (message) => {
                /*
                 * SYSTEM 메시지는
                 * 일반 채팅 말풍선이 아니라
                 * 시스템 안내 UI로 표시.
                 */
                if (
                  message.messageType ===
                  'SYSTEM'
                ) {
                  return (
                    <QuestCompleteNotice
                      key={
                        message.messageId
                      }
                      title={
                        message.content
                      }
                    />
                  );
                }

                /*
                 * 상대 memberId와 senderId가
                 * 같으면 상대 메시지.
                 * 아니면 내 메시지.
                 */
                const messageType =
                  message.senderId ===
                    partner.memberId
                    ? 'other'
                    : 'mine';

                return (
                  <MessageBubble
                    key={
                      message.messageId
                    }
                    type={
                      messageType
                    }
                    message={
                      message.content
                    }
                    time={formatMessageTime(
                      message.createdAt
                    )}
                  />
                );
              }
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
                setShowQuestCard(
                  false
                )
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