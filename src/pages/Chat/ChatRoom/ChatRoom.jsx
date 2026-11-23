import './ChatRoom.scss';

import {
  useEffect,
  useRef,
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
  createChatSocket,
  disconnectChatSocket,
  sendChatMessage,
} from '../../../api/chatSocket';

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

  const socketRef =
    useRef(null);

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
    isSocketConnected,
    setIsSocketConnected,
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

  const [
    showUnlockModal,
    setShowUnlockModal,
  ] = useState(
    location.state
      ?.showUnlockModal ===
    true
  );

  /*
   * 시간 표시
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
   * 현재 받아온 메시지 중
   * 가장 최신 messageId 확인
   */
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

          /*
           * 방 입장 시 현재 최신
           * 메시지까지 읽음 처리
           */
          const latestMessage =
            getLatestMessage(
              fetchedMessages
            );

          if (latestMessage) {
            try {
              await markChatRoomAsRead(
                chatId,
                latestMessage.messageId
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
          setIsLoading(false);
        }
      };

    fetchChatRoom();
  }, [chatId]);

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
    'COMPLETED';

  const isRelationshipEnded =
    location.state
      ?.relationshipEnded ===
    true;

  const writable =
    chatRoomDetail
      ?.writable === true;

  const apiCurrentStage =
    chatRoomDetail
      ?.currentStage;

  const questProgress =
    chatRoomDetail
      ?.questProgress;

  const apiCurrentQuest =
    chatRoomDetail
      ?.currentQuest;

  /*
   * =================================================
   * WebSocket 연결
   * =================================================
   *
   * ACTIVE 관계일 때만 실시간 채팅 연결.
   */
  useEffect(() => {
    if (
      relationshipStatus !==
      'ACTIVE'
    ) {
      return undefined;
    }

    /*
     * WebSocket 이벤트가 발생했을 때
     * 서버 기준 최신 상세 상태를
     * 다시 가져온다.
     */
    const refreshDetail =
      async () => {
        try {
          const data =
            await getChatRoomDetail(
              chatId
            );

          setChatRoomDetail(
            data
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
            '채팅방 상태 갱신 실패:',
            error
          );
        }
      };

    const client =
      createChatSocket({
        chatRoomId: chatId,

        /*
         * TEXT / SYSTEM 메시지 수신
         */
        onMessage: (
          receivedMessage
        ) => {
          setMessages(
            (
              previousMessages
            ) => {
              const duplicated =
                previousMessages.some(
                  (message) =>
                    message.messageId ===
                    receivedMessage.messageId
                );

              if (duplicated) {
                return previousMessages;
              }

              return [
                ...previousMessages,
                receivedMessage,
              ];
            }
          );

          /*
           * 지금 채팅방을 보고 있으므로
           * 새로 들어온 메시지도
           * 바로 읽음 처리
           */
          if (
            receivedMessage
              .messageId
          ) {
            markChatRoomAsRead(
              chatId,
              receivedMessage.messageId
            ).catch(
              (error) => {
                console.error(
                  '실시간 메시지 읽음 처리 실패:',
                  error
                );
              }
            );
          }
        },

        /*
         * 퀘스트/관계 이벤트
         */
        onEvent: (
          event
        ) => {
          console.log(
            '채팅 이벤트:',
            event
          );

          if (
            event.type ===
            'QUEST_OPENED'
          ) {
            /*
             * 서버에서 새 퀘스트가
             * 활성화됐으므로
             * 상세 상태 재조회 후
             * 퀘스트 카드 표시
             */
            refreshDetail();

            setShowQuestCard(
              true
            );

            return;
          }

          if (
            event.type ===
            'INFORMATION_UNLOCKED'
          ) {
            /*
             * 실제 해금 정보는
             * WebSocket payload가 아니라
             * 프로필 조회 API가 기준.
             *
             * 프로필 API 연동 전까지는
             * 채팅 상세만 최신화한다.
             */
            refreshDetail();

            return;
          }

          if (
            event.type ===
            'RELATIONSHIP_COMPLETED'
          ) {
            /*
             * 상세 API를 다시 불러오면
             * relationshipStatus가
             * COMPLETED가 되고
             * 입력창이 사라진다.
             */
            refreshDetail();
          }
        },

        /*
         * 개인 에러 채널
         */
        onError: (
          socketError
        ) => {
          console.error(
            '채팅 WebSocket 오류:',
            socketError
          );

          if (
            socketError.code ===
            'CHAT_ROOM_NOT_WRITABLE'
          ) {
            refreshDetail();
          }

          if (
            socketError.code ===
            'CHAT_ROOM_NOT_FOUND' ||
            socketError.code ===
            'CHAT_ROOM_ACCESS_DENIED'
          ) {
            navigate(
              '/chat'
            );
          }
        },

        onConnected: () => {
          setIsSocketConnected(
            true
          );
        },

        onDisconnected: () => {
          setIsSocketConnected(
            false
          );
        },
      });

    socketRef.current =
      client;

    return () => {
      setIsSocketConnected(
        false
      );

      disconnectChatSocket(
        client
      );

      socketRef.current =
        null;
    };
  }, [
    chatId,
    relationshipStatus,
    navigate,
  ]);

  /*
   * 이전 메시지 조회
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

            /*
             * 혹시 REST 요청 간
             * 중복 메시지가 생겨도
             * messageId 기준 제거
             */
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

  /*
   * 실제 메시지 전송
   */
  const handleSendMessage = (
    content
  ) => {
    try {
      sendChatMessage(
        socketRef.current,
        chatId,
        content
      );

      /*
       * 여기서 messages에
       * 직접 추가하지 않는다.
       *
       * 서버가 저장한 뒤
       * /sub/chat/{chatRoomId}로
       * broadcast한 메시지를 받아서
       * 화면에 추가한다.
       */
      return true;
    } catch (error) {
      console.error(
        '메시지 전송 실패:',
        error
      );

      return false;
    }
  };

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
      setModalType(
        'blockDone'
      );
    };

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

  const handleLeaveConfirm =
    () => {
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
              navigate(
                '/chat'
              )
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

                /*
                 * 상세 API의 상대 식별자는
                 * partner.userId
                 */
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
                    currentStage:
                      4,
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
                setModalType(
                  null
                )
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
                setModalType(
                  null
                )
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