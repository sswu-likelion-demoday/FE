import './ChatRoom.scss';

import ChatHeader from '../components/ChatHeader/ChatHeader';
import MessageBubble from '../components/MessageBubble/MessageBubble';
import ChatInput from '../components/ChatInput/ChatInput';
import QuestBanner from '../components/QuestBanner/QuestBanner';
import QuestCard from '../components/QuestCard/QuestCard';
import QuestCompleteNotice from '../components/QuestCompleteNotice/QuestCompleteNotice';

const ChatRoom = () => {
  const chatRoomData = {
    stage: 2,
    stageName: '알아가는 중',
    currentQuest: 4,
    totalQuest: 4,

    questLabel: '새 퀘스트 · 진행 중',
    questTitle: '상대 퀴즈 맞히기 ✨',

    unlockText: '2단계를 마치면 상대의 취미 · MBTI가 열려요',

    completedQuest: '같이 해보고 싶은 활동 이야기하기',

    questCard: {
      label: 'AI 퀴즈가 도착했어요',
      title: '상대 퀴즈 맞히기 ✨',
      description: '대화를 바탕으로 만든 달빛여우님 퀴즈예요.',
      subDescription: '2단계의 마지막 퀘스트예요!',
      primaryText: '퀴즈 풀기',
      secondaryText: '나중에',
    },
  };

  const messages = [
    {
      id: 1,
      type: 'other',
      message: '주말엔 보통 한강에서 러닝해요! 반포 쪽이요',
      time: '오후 8:07',
    },
    {
      id: 2,
      type: 'mine',
      message: '저 성수 쪽 카페 가보고 싶었어요!',
      time: '오후 8:09',
    },
    {
      id: 3,
      type: 'other',
      message: '오 거기 저도 가보고 싶었는데!',
      time: '오후 8:11',
    },
    {
      id: 4,
      type: 'mine',
      message: '저는 같이 클라이밍 해보고 싶어요!',
      time: '오후 8:15',
    },
  ];

  return (
    <div className="page">
      <div className="chat_room">
        <ChatHeader />

        <QuestBanner
          stage={chatRoomData.stage}
          stageName={chatRoomData.stageName}
          currentQuest={chatRoomData.currentQuest}
          totalQuest={chatRoomData.totalQuest}
          title={chatRoomData.questTitle}
          questLabel={chatRoomData.questLabel}
          unlockText={chatRoomData.unlockText}
        />

        <div className="chat_room_body">
          <main className="chat_room_messages">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                type={message.type}
                message={message.message}
                time={message.time}
              />
            ))}

            <QuestCompleteNotice
              title={chatRoomData.completedQuest}
            />
          </main>
        </div>

        <QuestCard
          label={chatRoomData.questCard.label}
          title={chatRoomData.questCard.title}
          description={chatRoomData.questCard.description}
          subDescription={chatRoomData.questCard.subDescription}
          primaryText={chatRoomData.questCard.primaryText}
          secondaryText={chatRoomData.questCard.secondaryText}
        />

        <ChatInput />
      </div>
    </div>
  );
};

export default ChatRoom;