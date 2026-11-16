import './ChatList.scss';

import { useLocation, useNavigate } from 'react-router-dom';

import BottomNav from '../../../components/BottomNav/BottomNav';

import quest_orb from '../../../assets/images/Chat/quest_orb.svg';
import profile_purple from '../../../assets/images/Chat/profile_purple.svg';
import profile_pink from '../../../assets/images/Chat/profile_pink.svg';
import profile_blue from '../../../assets/images/Chat/profile_blue.svg';

const chatData = [
  {
    id: 1,
    profileImage: profile_purple,
    profileText: '달',
    name: '달빛여우',
    quest: '2단계 · 알아가는 중',
    questStatus: 'progress',
    message:
      '주말엔 보통 한강에서 러닝해요! 반포 쪽이요',
    time: '방금',
    unread: 2,
  },
  {
    id: 2,
    profileImage: profile_pink,
    profileText: '새',
    name: '새벽산책',
    quest: null,
    questStatus: null,
    message: '안녕하세요:)',
    time: '오후 6:12',
    unread: 1,
  },
  {
    id: 3,
    profileImage: profile_blue,
    profileText: '고',
    name: '고양이집사',
    quest: '인연 완료',
    questStatus: 'complete',
    message: '다음에 그 카페 같이 가봐요',
    time: '어제',
    unread: 0,
  },
];

function ChatList() {
  const navigate = useNavigate();
  const location = useLocation();

  const blockedChatId =
    location.state?.blockedChatId;

  const endedChatId =
    location.state?.endedChatId;

  const completedChatId =
    location.state?.completedChatId;

  /*
   * 차단된 채팅은 목록에서 숨김
   */
  const visibleChatData =
    chatData.filter(
      (chat) =>
        chat.id !== blockedChatId
    );

  /*
   * 진행 중 인연 계산
   *
   * 관계 종료 → 제외
   * 인연 완료 → 제외
   * 나머지 → 진행 중
   */
  const activeRelationshipCount =
    visibleChatData.filter((chat) => {
      const isEnded =
        chat.id === endedChatId;

      const isComplete =
        chat.questStatus === 'complete' ||
        chat.id === completedChatId;

      return (
        !isEnded &&
        !isComplete
      );
    }).length;

  const totalRelationshipCount =
    visibleChatData.length;

  return (
    <div className="page">
      <div className="chat_list">
        <header className="chat_list_header">
          <h1 className="chat_list_title">
            채팅
          </h1>
        </header>

        <main className="chat_list_content">
          <section className="list_quest_banner">
            <img
              src={quest_orb}
              alt=""
              className="list_quest_banner_img"
            />

            <div className="list_quest_banner_content">
              <strong className="list_quest_banner_title">
                대화하며 인연을 이어가 보세요
              </strong>

              <p className="list_quest_banner_ment">
                퀘스트를 통해 서로를 알아가요
              </p>
            </div>

            <span className="list_quest_banner_badge">
              진행 중{' '}
              {activeRelationshipCount}/
              {totalRelationshipCount}
            </span>
          </section>

          <h2 className="chat_list_count">
            나의 인연{' '}
            {visibleChatData.length}
          </h2>

          <section className="chat_list_items">
            {visibleChatData.map(
              (chat) => {
                const isEnded =
                  chat.id ===
                  endedChatId;

                const isComplete =
                  !isEnded &&
                  (chat.questStatus ===
                    'complete' ||
                    chat.id ===
                    completedChatId);

                const handleChatClick =
                  () => {
                    if (isEnded) {
                      navigate(
                        `/chat/${chat.id}`,
                        {
                          state: {
                            relationshipEnded:
                              true,
                          },
                        }
                      );

                      return;
                    }

                    if (isComplete) {
                      navigate(
                        `/chat/${chat.id}`,
                        {
                          state: {
                            relationshipComplete:
                              true,
                            completedStage: 4,
                            currentStage: 4,
                            stage: 4,
                            quest: 4,
                          },
                        }
                      );

                      return;
                    }

                    navigate(
                      `/chat/${chat.id}`
                    );
                  };

                return (
                  <button
                    type="button"
                    className="chat_item"
                    key={chat.id}
                    onClick={
                      handleChatClick
                    }
                  >
                    <div className="chat_item_profile_wrap">
                      <img
                        src={
                          chat.profileImage
                        }
                        alt={`${chat.name} 프로필`}
                        className="chat_item_profile"
                      />

                      <span className="chat_item_profile_text">
                        {
                          chat.profileText
                        }
                      </span>
                    </div>

                    <div className="chat_item_content">
                      <div className="chat_item_top">
                        <div className="chat_item_name_area">
                          <strong className="chat_item_name">
                            {chat.name}
                          </strong>

                          {isEnded ? (
                            <span className="chat_item_quest chat_item_quest_complete">
                              관계 종료
                            </span>
                          ) : isComplete ? (
                            <span className="chat_item_quest chat_item_quest_complete">
                              인연 완료
                            </span>
                          ) : (
                            chat.quest && (
                              <span
                                className={`chat_item_quest chat_item_quest_${chat.questStatus}`}
                              >
                                {
                                  chat.quest
                                }
                              </span>
                            )
                          )}
                        </div>

                        <span className="chat_item_time">
                          {chat.time}
                        </span>
                      </div>

                      <div className="chat_item_bottom">
                        <p className="chat_item_message">
                          {isEnded
                            ? '이번 수정과의 인연은 여기서 마무리되었어요.'
                            : isComplete
                              ? '인연이 완성되었어요!'
                              : chat.message}
                        </p>

                        {!isEnded &&
                          !isComplete &&
                          chat.unread >
                          0 && (
                            <span className="chat_item_unread">
                              {
                                chat.unread
                              }
                            </span>
                          )}
                      </div>
                    </div>
                  </button>
                );
              }
            )}
          </section>
        </main>
      </div>

      <BottomNav initialMenu="chat" />
    </div>
  );
}

export default ChatList;