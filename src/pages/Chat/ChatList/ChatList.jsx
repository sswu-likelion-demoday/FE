import './ChatList.scss';

import {
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import BottomNav from '../../../components/BottomNav/BottomNav';

import { getChatRooms } from '../../../api/chat';

import quest_orb from '../../../assets/images/Chat/quest_orb.svg';
import profile_purple from '../../../assets/images/Chat/profile_purple.svg';
import profile_pink from '../../../assets/images/Chat/profile_pink.svg';
import profile_blue from '../../../assets/images/Chat/profile_blue.svg';

const defaultProfileImages = [
  profile_purple,
  profile_pink,
  profile_blue,
];

const formatMessageTime = (dateString) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();

  const diffMilliseconds =
    now.getTime() - date.getTime();

  const diffMinutes = Math.floor(
    diffMilliseconds / (1000 * 60)
  );

  if (diffMinutes >= 0 && diffMinutes < 1) {
    return '방금';
  }

  const isToday =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (isToday) {
    return date.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  const yesterday = new Date(now);

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const isYesterday =
    yesterday.getFullYear() ===
    date.getFullYear() &&
    yesterday.getMonth() ===
    date.getMonth() &&
    yesterday.getDate() ===
    date.getDate();

  if (isYesterday) {
    return '어제';
  }

  return `${date.getMonth() + 1}/${date.getDate()}`;
};

function ChatList() {
  const navigate = useNavigate();

  const [chatRooms, setChatRooms] =
    useState([]);

  const [totalCount, setTotalCount] =
    useState(0);

  const [activeCount, setActiveCount] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const data =
          await getChatRooms();

        setChatRooms(
          data.chatRooms ?? []
        );

        setTotalCount(
          data.totalCount ?? 0
        );

        setActiveCount(
          data.activeCount ?? 0
        );
      } catch (error) {
        setErrorMessage(
          error.message ||
          '채팅방 목록을 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  const handleChatClick = (chat) => {
    const isComplete =
      chat.relationshipStatus ===
      'COMPLETED';

    if (isComplete) {
      navigate(
        `/chat/${chat.chatRoomId}`,
        {
          state: {
            relationshipComplete: true,
            completedStage: 4,
            currentStage: 4,
            stage: 4,
            quest: 4,
            relationshipId:
              chat.relationshipId,
          },
        }
      );

      return;
    }

    navigate(
      `/chat/${chat.chatRoomId}`,
      {
        state: {
          relationshipId:
            chat.relationshipId,
          stage:
            chat.currentStage?.stage ??
            1,
        },
      }
    );
  };

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
              {activeCount}/
              {totalCount}
            </span>
          </section>

          <h2 className="chat_list_count">
            나의 인연 {totalCount}
          </h2>

          <section className="chat_list_items">
            {isLoading && (
              <p>
                채팅 목록을 불러오는 중이에요.
              </p>
            )}

            {!isLoading &&
              errorMessage && (
                <p>
                  {errorMessage}
                </p>
              )}

            {!isLoading &&
              !errorMessage &&
              chatRooms.length === 0 && (
                <p>
                  아직 진행 중인 인연이 없어요.
                </p>
              )}

            {!isLoading &&
              !errorMessage &&
              chatRooms.map(
                (chat, index) => {
                  const isComplete =
                    chat.relationshipStatus ===
                    'COMPLETED';

                  const partner =
                    chat.partner ?? {};

                  const hasUnlockedProfileImage =
                    partner.profileImageUnlocked ===
                    true &&
                    partner.profileImageUrl;

                  const profileImage =
                    hasUnlockedProfileImage
                      ? partner.profileImageUrl
                      : defaultProfileImages[
                      index %
                      defaultProfileImages.length
                      ];

                  const profileText =
                    partner.nickname?.charAt(
                      0
                    ) ?? '';

                  const questText =
                    isComplete
                      ? '인연 완료'
                      : chat.currentStage
                        ? `${chat.currentStage.stage}단계 · ${chat.currentStage.name}`
                        : null;

                  const questStatus =
                    isComplete
                      ? 'complete'
                      : 'progress';

                  return (
                    <button
                      type="button"
                      className="chat_item"
                      key={
                        chat.chatRoomId
                      }
                      onClick={() =>
                        handleChatClick(
                          chat
                        )
                      }
                    >
                      <div className="chat_item_profile_wrap">
                        <img
                          src={
                            profileImage
                          }
                          alt={`${partner.nickname ?? '상대방'} 프로필`}
                          className="chat_item_profile"
                        />

                        {!hasUnlockedProfileImage && (
                          <span className="chat_item_profile_text">
                            {
                              profileText
                            }
                          </span>
                        )}
                      </div>

                      <div className="chat_item_content">
                        <div className="chat_item_top">
                          <div className="chat_item_name_area">
                            <strong className="chat_item_name">
                              {
                                partner.nickname
                              }
                            </strong>

                            {questText && (
                              <span
                                className={`chat_item_quest chat_item_quest_${questStatus}`}
                              >
                                {
                                  questText
                                }
                              </span>
                            )}
                          </div>

                          <span className="chat_item_time">
                            {formatMessageTime(
                              chat.lastMessageAt
                            )}
                          </span>
                        </div>

                        <div className="chat_item_bottom">
                          <p className="chat_item_message">
                            {isComplete
                              ? '인연이 완성되었어요!'
                              : chat.lastMessage}
                          </p>

                          {!isComplete &&
                            chat.unreadCount >
                            0 && (
                              <span className="chat_item_unread">
                                {
                                  chat.unreadCount
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