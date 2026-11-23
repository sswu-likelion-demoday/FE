import './ChatRoom.scss';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getChatRoomDetail,
  getChatMessages,
  markChatRoomAsRead,
} from '../../../api/chat';

import {
  blockUser,
  endRelationship,
} from '../../../api/relationship';

import {
  useChatSocket,
} from '../ChatSocketLayout';

import ChatHeader from '../components/ChatHeader/ChatHeader';
import MessageBubble from '../components/MessageBubble/MessageBubble';
import ChatInput from '../components/ChatInput/ChatInput';
import QuestBanner from '../components/QuestBanner/QuestBanner';
import QuestCard from '../components/QuestCard/QuestCard';
import QuestCompleteNotice from '../components/QuestCompleteNotice/QuestCompleteNotice';
import ChatMenu from '../components/ChatMenu/ChatMenu';
import ChatModal from '../components/ChatModal/ChatModal';

import {
  getRelationshipStage,
  getQuest,
} from '../data/relationshipData';

import quest_orb from '../../../assets/images/Chat/quest_orb.svg';

const ChatRoom = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { chatId } =
    useParams();

  const {
    isSocketConnected,
    latestMessage,
    latestEvent,
    relationshipCompleted,
    sendMessage,
    syncRelationshipStatus,
  } = useChatSocket();

  const numericChatId =
    Number(chatId);

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
    isActionLoading,
    setIsActionLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    showMenu,
    setShowMenu,
  ] = useState(false);

  const [
    modalType,
    setModalType,
  ] = useState(null);

  const [
    showQuestCard,
    setShowQuestCard,
  ] = useState(false);

  const formatMessageTime = (
    dateString
  ) => {
    if (!dateString) {
      return '';
    }

    const date =
      new Date(
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

  const getLatestMessage = (
    messageList
  ) => {
    if (
      !messageList ||
      messageList.length === 0
    ) {
      return null;
    }

    return messageList.reduce(
      (
        latest,
        current
      ) => {
        if (!latest) {
          return current;
        }

        return Number(
          current.messageId
        ) >
          Number(
            latest.messageId
          )
          ? current
          : latest;
      },
      null
    );
  };

  const refreshChatRoomDetail =
    useCallback(
      async () => {
        try {
          const data =
            await getChatRoomDetail(
              chatId
            );

          setChatRoomDetail(
            data
          );

          syncRelationshipStatus(
            data.relationshipStatus
          );

          if (
            data.relationshipStatus ===
            'ACTIVE' &&
            data.currentQuest
          ) {
            setShowQuestCard(
              true
            );
          } else {
            setShowQuestCard(
              false
            );
          }
        } catch (error) {
          console.error(
            '채팅방 상세 갱신 실패:',
            error
          );
        }
      },
      [
        chatId,
        syncRelationshipStatus,
      ]
    );

  /*
   * 최초 상세 + 메시지 조회
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

          syncRelationshipStatus(
            detailData
              .relationshipStatus
          );

          const fetchedMessages =
            messageData.messages ??
            [];

          setMessages(
            fetchedMessages
          );

          setNextCursor(
            messageData.nextCursor ??
            null
          );

          setHasNextMessages(
            messageData.hasNext ??
            false
          );

          const latest =
            getLatestMessage(
              fetchedMessages
            );

          if (latest) {
            try {
              await markChatRoomAsRead(
                chatId,
                latest.messageId
              );
            } catch (
            readError
            ) {
              console.error(
                '메시지 읽음 처리 실패:',
                readError
              );
            }
          }

          if (
            detailData
              .relationshipStatus ===
            'ACTIVE' &&
            detailData.currentQuest
          ) {
            setShowQuestCard(
              true
            );
          } else {
            setShowQuestCard(
              false
            );
          }
        } catch (error) {
          setErrorMessage(
            error.message ||
            '채팅방 정보를 불러오지 못했습니다.'
          );
        } finally {
          setIsLoading(
            false
          );
        }
      };

    fetchChatRoom();
  }, [
    chatId,
    syncRelationshipStatus,
  ]);

  /*
   * 실시간 메시지
   */
  useEffect(() => {
    if (
      !latestMessage ||
      relationshipCompleted
    ) {
      return;
    }

    setMessages(
      (
        previousMessages
      ) => {
        const duplicated =
          previousMessages.some(
            (message) =>
              message.messageId ===
              latestMessage.messageId
          );

        if (duplicated) {
          return previousMessages;
        }

        return [
          ...previousMessages,
          latestMessage,
        ];
      }
    );

    if (
      latestMessage.messageId
    ) {
      markChatRoomAsRead(
        chatId,
        latestMessage.messageId
      ).catch(
        (error) => {
          console.error(
            '실시간 메시지 읽음 처리 실패:',
            error
          );
        }
      );
    }
  }, [
    latestMessage,
    chatId,
    relationshipCompleted,
  ]);

  /*
   * WebSocket 이벤트
   */
  useEffect(() => {
    if (!latestEvent) {
      return;
    }

    if (
      latestEvent.type ===
      'QUEST_OPENED'
    ) {
      refreshChatRoomDetail();

      setShowQuestCard(
        true
      );

      return;
    }

    if (
      latestEvent.type ===
      'INFORMATION_UNLOCKED'
    ) {
      refreshChatRoomDetail();

      return;
    }

    if (
      latestEvent.type ===
      'RELATIONSHIP_COMPLETED'
    ) {
      setShowQuestCard(
        false
      );

      refreshChatRoomDetail();
    }
  }, [
    latestEvent,
    refreshChatRoomDetail,
  ]);

  const partner =
    chatRoomDetail?.partner ??
    {};

  const relationshipId =
    chatRoomDetail
      ?.relationshipId;

  const relationshipStatus =
    chatRoomDetail
      ?.relationshipStatus;

  const isRelationshipComplete =
    relationshipStatus ===
    'COMPLETED' ||
    relationshipCompleted;

  /*
   * ENDED는 관계 종료 후
   * 목록으로 이동하므로
   * 기존 퍼블리싱 state만 유지.
   */
  const isRelationshipEnded =
    location.state
      ?.relationshipEnded ===
    true;

  const writable =
    chatRoomDetail
      ?.writable === true &&
    !relationshipCompleted;

  const apiCurrentStage =
    chatRoomDetail
      ?.currentStage;

  const questProgress =
    chatRoomDetail
      ?.questProgress;

  const apiCurrentQuest =
    chatRoomDetail
      ?.currentQuest;

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
          localCurrentQuest
            .guide
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
        navigate(
          questPath,
          {
            state: {
              relationshipId,

              relationshipQuestId:
                apiCurrentQuest
                  ?.relationshipQuestId,

              stage:
                currentStage,

              quest:
                currentQuestNumber,
            },
          }
        );

        return;
      }

      setShowQuestCard(
        false
      );
    };

  const handleRelationshipClick =
    () => {
      navigate(
        `/chat/${chatId}/relationship`,
        {
          state: {
            relationshipId,

            stage:
              currentStage,

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

  /*
   * 이전 메시지
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
          (
            previousMessages
          ) => {
            const oldMessages =
              data.messages ??
              [];

            const existingIds =
              new Set(
                previousMessages.map(
                  (message) =>
                    message.messageId
                )
              );

            const newMessages =
              oldMessages.filter(
                (message) =>
                  !existingIds.has(
                    message.messageId
                  )
              );

            return [
              ...newMessages,
              ...previousMessages,
            ];
          }
        );

        setNextCursor(
          data.nextCursor ??
          null
        );

        setHasNextMessages(
          data.hasNext ??
          false
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

  const handleSendMessage = (
    content
  ) => {
    if (
      isRelationshipComplete
    ) {
      return false;
    }

    return sendMessage(
      content
    );
  };

  /*
   * 차단 확인 모달 열기
   */
  const handleBlock = () => {
    setShowMenu(false);

    setModalType(
      'blockConfirm'
    );
  };

  /*
   * 관계 종료 확인 모달 열기
   */
  const handleLeave = () => {
    setShowMenu(false);

    setModalType(
      'leaveConfirm'
    );
  };

  /*
   * 실제 사용자 차단 API
   */
  const handleBlockConfirm =
    async () => {
      if (
        !partner.userId ||
        isActionLoading
      ) {
        return;
      }

      try {
        setIsActionLoading(
          true
        );

        await blockUser(
          partner.userId
        );

        /*
         * 성공 후 기존 완료 모달 사용
         */
        setModalType(
          'blockDone'
        );
      } catch (error) {
        console.error(
          '사용자 차단 실패:',
          error
        );

        /*
         * 존재하지 않는 상대라면
         * 더 이상 현재 채팅을 유지할
         * 이유가 없으므로 목록 이동
         */
        if (
          error.code ===
          'USER_NOT_FOUND'
        ) {
          navigate('/chat');

          return;
        }

        if (
          error.code ===
          'CANNOT_BLOCK_SELF'
        ) {
          window.alert(
            '자기 자신은 차단할 수 없습니다.'
          );

          return;
        }

        window.alert(
          error.message ||
          '사용자 차단에 실패했습니다.'
        );
      } finally {
        setIsActionLoading(
          false
        );
      }
    };

  /*
   * 차단 완료 모달 닫기
   */
  const handleBlockDone = () => {
    setModalType(null);

    navigate(
      '/chat',
      {
        state: {
          blockedChatId:
            numericChatId,
        },
      }
    );
  };

  /*
   * 실제 관계 종료 API
   */
  const handleLeaveConfirm =
    async () => {
      if (
        !relationshipId ||
        isActionLoading
      ) {
        return;
      }

      try {
        setIsActionLoading(
          true
        );

        await endRelationship(
          relationshipId
        );

        /*
         * 관계 종료 후에는
         * 채팅 목록으로 이동
         */
        setModalType(null);

        navigate(
          '/chat',
          {
            state: {
              endedChatId:
                numericChatId,
            },
          }
        );
      } catch (error) {
        console.error(
          '관계 종료 실패:',
          error
        );

        if (
          error.code ===
          'RELATIONSHIP_NOT_FOUND' ||
          error.code ===
          'RELATIONSHIP_ALREADY_ENDED'
        ) {
          navigate('/chat');

          return;
        }

        if (
          error.code ===
          'RELATIONSHIP_ACCESS_DENIED'
        ) {
          window.alert(
            '이 관계에 접근할 수 없습니다.'
          );

          navigate('/chat');

          return;
        }

        if (
          error.code ===
          'RELATIONSHIP_ALREADY_COMPLETED'
        ) {
          /*
           * 이미 완성된 관계는
           * 중도 종료할 수 없음.
           */
          setModalType(null);

          window.alert(
            '이미 완료된 관계는 종료할 수 없습니다.'
          );

          refreshChatRoomDetail();

          return;
        }

        window.alert(
          error.message ||
          '관계 종료에 실패했습니다.'
        );
      } finally {
        setIsActionLoading(
          false
        );
      }
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
                      currentStage:
                        4,
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
              apiCurrentStage
                ?.stage
            }
            stageName={
              apiCurrentStage
                ?.name
            }
            currentQuest={
              currentQuestNumber
            }
            totalQuest={
              questProgress
                ?.total ??
              currentStageData
                .quests.length
            }
            title={
              apiCurrentQuest
                ?.title ??
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

                const messageType =
                  message.senderId ===
                    partner.userId
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
                    time={
                      formatMessageTime(
                        message.createdAt
                      )
                    }
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
                questCardData
                  .label
              }
              title={
                questCardData
                  .title
              }
              description={
                questCardData
                  .description
              }
              subDescription={
                questCardData
                  .subDescription
              }
              primaryText={
                questCardData
                  .primaryText
              }
              secondaryText={
                questCardData
                  .secondaryText
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
            <ChatInput
              onSend={
                handleSendMessage
              }
              disabled={
                !isSocketConnected
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
              onClose={() => {
                if (
                  !isActionLoading
                ) {
                  setModalType(
                    null
                  );
                }
              }}
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
              onClose={() => {
                if (
                  !isActionLoading
                ) {
                  setModalType(
                    null
                  );
                }
              }}
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