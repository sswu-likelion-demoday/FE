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
    sendMessage,
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

  /*
   * 메시지 시간 표시
   */
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

  /*
   * 가장 최신 messageId 찾기
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
   * 채팅방 상세만 다시 조회
   *
   * WebSocket 이벤트 발생 후
   * 서버 기준 최신 상태로 갱신한다.
   */
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
      [chatId]
    );

  /*
   * 최초 채팅방 상세 +
   * 메시지 내역 조회
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
           * 현재 받아온 메시지 중
           * 가장 최신 메시지까지
           * 읽음 처리
           */
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
  }, [chatId]);

  /*
   * WebSocket으로 새 메시지를
   * 받았을 때 화면에 추가
   */
  useEffect(() => {
    if (!latestMessage) {
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

    /*
     * 현재 채팅방을 보고 있으므로
     * 새 메시지도 바로 읽음 처리
     */
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
  ]);

  /*
   * WebSocket 관계 / 퀘스트 이벤트 처리
   */
  useEffect(() => {
    if (!latestEvent) {
      return;
    }

    if (
      latestEvent.type ===
      'QUEST_OPENED'
    ) {
      /*
       * 서버에서 다음 퀘스트가
       * 활성화됐으므로 상세 재조회
       */
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
      /*
       * 해금 모달은
       * ChatSocketLayout이 표시.
       *
       * ChatRoom에서는 현재 단계와
       * 퀘스트만 최신 상태로 갱신.
       */
      refreshChatRoomDetail();

      return;
    }

    if (
      latestEvent.type ===
      'RELATIONSHIP_COMPLETED'
    ) {
      /*
       * 상세 조회 결과가
       * COMPLETED가 되면
       * 입력창이 사라지고
       * 읽기 전용으로 전환된다.
       */
      refreshChatRoomDetail();
    }
  }, [
    latestEvent,
    refreshChatRoomDetail,
  ]);

  /*
   * 상세 API 기준 상태
   */
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

  /*
   * 기존 퍼블리싱 테스트용
   */
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
   * 화면 이동 경로용
   * 로컬 퀘스트 데이터
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

  /*
   * relationshipData에 남아 있는
   * /chat/1 경로를 현재 chatId로 변경
   */
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

      /*
       * AI 퀴즈
       */
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

      /*
       * 인증 퀘스트
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

          secondaryText:
            '나중에',
        };
      }

      /*
       * 일반 채팅 퀘스트
       */
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

  /*
   * 퀘스트 카드 버튼
   */
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

      /*
       * 일반 채팅 퀘스트는
       * 버튼 클릭만으로 완료하지 않는다.
       */
      setShowQuestCard(
        false
      );
    };

  /*
   * 관계 진행도 화면
   */
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
             * REST 요청 중
             * 실시간 메시지가 들어왔을 경우를
             * 대비해 중복 제거
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
   * 실시간 메시지 전송
   */
  const handleSendMessage = (
    content
  ) => {
    return sendMessage(
      content
    );
  };

  /*
   * 채팅 메뉴
   */
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

  /*
   * 로딩
   */
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

  /*
   * 에러
   */
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
                /*
                 * 시스템 메시지
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
                 * 상대 userId와 같으면
                 * 상대 메시지.
                 *
                 * 다르면 내 메시지.
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