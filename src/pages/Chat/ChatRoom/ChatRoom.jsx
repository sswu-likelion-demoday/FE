import './ChatRoom.scss';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const isRelationshipComplete =
    location.state?.relationshipComplete === true;

  const isRelationshipEnded =
    location.state?.relationshipEnded === true;

  const currentStage =
    location.state?.stage ?? 1;

  const currentQuestNumber =
    location.state?.quest ?? 1;

  const currentStageData =
    getRelationshipStage(currentStage);

  const currentQuest =
    getQuest(
      currentStage,
      currentQuestNumber
    );

  const previousQuest =
    currentQuestNumber > 1
      ? getQuest(
        currentStage,
        currentQuestNumber - 1
      )
      : null;

  const [showMenu, setShowMenu] =
    useState(false);

  const [modalType, setModalType] =
    useState(null);

  const [showQuestCard, setShowQuestCard] =
    useState(
      !isRelationshipComplete &&
      !isRelationshipEnded
    );

  const [
    showStageComplete,
    setShowStageComplete,
  ] = useState(false);

  /*
   * 4단계 해금 모달은
   * 첫 만남 인증 직후에만 표시
   */
  const [
    showUnlockModal,
    setShowUnlockModal,
  ] = useState(
    location.state?.showUnlockModal === true
  );

  useEffect(() => {
    if (
      !isRelationshipComplete &&
      !isRelationshipEnded
    ) {
      setShowQuestCard(true);
    }
  }, [
    currentStage,
    currentQuestNumber,
    isRelationshipComplete,
    isRelationshipEnded,
  ]);

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

  const getOrdinal = (questNumber) => {
    const ordinals = {
      1: '첫 번째',
      2: '두 번째',
      3: '세 번째',
      4: '네 번째',
    };

    return ordinals[questNumber];
  };

  const getQuestCardData = () => {
    if (currentQuest.type === 'AI_QUIZ') {
      return {
        label: 'AI 퀴즈가 도착했어요',
        title: currentQuest.title,
        description:
          '대화를 바탕으로 만든 달빛여우님 퀴즈예요.',
        subDescription: `${currentStage}단계의 마지막 퀘스트예요!`,
        primaryText: '퀴즈 풀기',
        secondaryText: '나중에',
      };
    }

    if (
      currentQuest.type === 'VERIFICATION'
    ) {
      return {
        label: '새 퀘스트가 열렸어요',
        title: currentQuest.title,
        description:
          '실제로 만났다면 첫 만남을 인증해보세요.',
        subDescription: `${currentStage}단계의 마지막 퀘스트예요!`,
        primaryText: '인증하러 가기',
        secondaryText: '나중에',
      };
    }

    return {
      label: '새 퀘스트가 열렸어요',
      title: currentQuest.title,
      description: `채팅으로 ${currentQuest.guide}.`,
      subDescription: `${currentStage}단계의 ${getOrdinal(
        currentQuestNumber
      )} 퀘스트예요!`,
      primaryText: '퀘스트 보기',
      secondaryText: '나중에',
    };
  };

  const questCardData =
    getQuestCardData();

  const handleQuestPrimaryClick = () => {
    if (currentQuest.path) {
      navigate(currentQuest.path, {
        state: {
          stage: currentStage,
          quest: currentQuestNumber,
        },
      });

      return;
    }

    const isLastQuest =
      currentQuestNumber ===
      currentStageData.quests.length;

    if (!isLastQuest) {
      navigate('/chat/1', {
        state: {
          stage: currentStage,
          quest:
            currentQuestNumber + 1,
        },
      });

      return;
    }

    setShowQuestCard(false);
    setShowStageComplete(true);
  };

  const handleStageContinue = () => {
    const nextStage =
      currentStage + 1;

    setShowStageComplete(false);

    navigate('/chat/1', {
      state: {
        stage: nextStage,
        quest: 1,
      },
    });
  };

  const handleRelationshipClick = () => {
    navigate('/chat/1/relationship', {
      state: {
        stage: currentStage,
        quest: currentQuestNumber,
        relationshipComplete:
          isRelationshipComplete,
      },
    });
  };

  const handleBlock = () => {
    setShowMenu(false);
    setModalType('blockConfirm');
  };

  const handleLeave = () => {
    setShowMenu(false);
    setModalType('leaveConfirm');
  };

  const handleBlockConfirm = () => {
    setModalType('blockDone');
  };

  const handleBlockDone = () => {
    setModalType(null);

    navigate('/chat', {
      state: {
        blockedChatId: 1,
      },
    });
  };

  const handleLeaveConfirm = () => {
    setModalType(null);

    navigate('/chat', {
      state: {
        endedChatId: 1,
      },
    });
  };

  return (
    <div className="page">
      <div className="chat_room">
        <ChatHeader
          onProfileClick={() =>
            setShowMenu(true)
          }
          currentStage={currentStage}
          currentQuestNumber={
            currentQuestNumber
          }
          isRelationshipComplete={
            isRelationshipComplete
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
              4단계의 모든 퀘스트를 완료했어요.
              <br />
              이제 이 채팅방은 읽기 전용으로
              보관돼요.
            </p>

            <button
              type="button"
              className="relationship_complete_banner_link"
              onClick={() =>
                navigate('/chat/1/profile', {
                  state: {
                    completedStage: 4,
                    currentStage: 4,
                  },
                })
              }
            >
              상대 프로필 보기 &gt;
            </button>
          </div>
        ) : isRelationshipEnded ? (
          <div className="relationship_end_banner">
            <strong className="relationship_end_banner_title">
              이번 수정과의 인연은 여기서
              마무리되었어요.
            </strong>

            <p className="relationship_end_banner_description">
              지금까지 나눈 대화는 읽기모드로
              확인할 수 있어요.
            </p>
          </div>
        ) : (
          <QuestBanner
            stage={currentStageData.stage}
            stageName={
              currentStageData.stageName
            }
            currentQuest={
              currentQuestNumber
            }
            totalQuest={
              currentStageData.quests.length
            }
            title={currentQuest.title}
            questLabel={
              showQuestCard
                ? '새 퀘스트 · 진행 중'
                : '진행 중 퀘스트'
            }
            unlockText={
              currentStageData.unlockText
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
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                type={message.type}
                message={message.message}
                time={message.time}
              />
            ))}

            {isRelationshipComplete && (
              <QuestCompleteNotice
                title="첫 만남 상호 인증하기"
              />
            )}

            {!isRelationshipComplete &&
              !isRelationshipEnded &&
              previousQuest && (
                <QuestCompleteNotice
                  title={previousQuest.title}
                />
              )}
          </main>
        </div>

        {!isRelationshipComplete &&
          !isRelationshipEnded &&
          showQuestCard &&
          questCardData && (
            <QuestCard
              label={questCardData.label}
              title={questCardData.title}
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

        {!isRelationshipComplete &&
          !isRelationshipEnded && (
            <ChatInput />
          )}

        {showStageComplete && (
          <StageCompleteModal
            stage={
              currentStageData.stage
            }
            title={`${currentStageData.unlockTitle}가 해금됐어요!`}
            reward="+10 수정구"
            infoLabel="해금된 정보"
            infoValue={
              currentStageData.unlockTitle
            }
            profileButtonText="프로필에서 보기"
            continueButtonText="대화 계속하기"
            onProfile={() =>
              navigate('/chat/1/profile', {
                state: {
                  completedStage:
                    currentStage,
                  currentStage:
                    currentStage + 1,
                },
              })
            }
            onContinue={
              handleStageContinue
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
              navigate('/chat/1/profile', {
                state: {
                  completedStage: 4,
                  currentStage: 4,
                },
              })
            }
            onContinue={() =>
              setShowUnlockModal(false)
            }
          />
        )}

        {showMenu && (
          <ChatMenu
            onClose={() =>
              setShowMenu(false)
            }
            onProfile={() =>
              navigate('/chat/1/profile', {
                state: {
                  completedStage:
                    isRelationshipComplete
                      ? 4
                      : Math.max(
                        currentStage - 1,
                        0
                      ),
                  currentStage:
                    isRelationshipComplete
                      ? 4
                      : currentStage,
                },
              })
            }
            onBlock={handleBlock}
            onLeave={handleLeave}
            currentStage={currentStage}
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
              onClose={handleBlockDone}
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