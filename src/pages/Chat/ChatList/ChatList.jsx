import './ChatList.scss';

import { useNavigate } from 'react-router-dom';

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
    message: '주말엔 보통 한강에서 러닝해요! 반포 쪽이요',
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

  return (
    <div className="page">
      <div className="chat_list">
        <header className="chat_list_header">
          <h1 className="chat_list_title">채팅</h1>
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
              진행 중 2/3
            </span>
          </section>

          <h2 className="chat_list_count">
            나의 인연 {chatData.length}
          </h2>

          <section className="chat_list_items">
            {chatData.map((chat) => (
              <button
                type="button"
                className="chat_item"
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <div className="chat_item_profile_wrap">
                  <img
                    src={chat.profileImage}
                    alt={`${chat.name} 프로필`}
                    className="chat_item_profile"
                  />

                  <span className="chat_item_profile_text">
                    {chat.profileText}
                  </span>
                </div>

                <div className="chat_item_content">
                  <div className="chat_item_top">
                    <div className="chat_item_name_area">
                      <strong className="chat_item_name">
                        {chat.name}
                      </strong>

                      {chat.quest && (
                        <span
                          className={`chat_item_quest chat_item_quest_${chat.questStatus}`}
                        >
                          {chat.quest}
                        </span>
                      )}
                    </div>

                    <span className="chat_item_time">
                      {chat.time}
                    </span>
                  </div>

                  <div className="chat_item_bottom">
                    <p className="chat_item_message">
                      {chat.message}
                    </p>

                    {chat.unread > 0 && (
                      <span className="chat_item_unread">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </section>
        </main>
      </div>

      <BottomNav initialMenu="chat" />
    </div>
  );
}

export default ChatList;