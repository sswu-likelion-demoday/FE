import './ChatList.scss';
import BottomNav from '../../../components/BottomNav/BottomNav';

import menu_icon from '../../../assets/images/Chat/menu_icon.svg';
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
        message: '안녕하세용:)',
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
    return (
        <div className="page">
            <div className="chat-list">
                <header className="chat-list__header">
                    <h1 className="chat-list__title">채팅</h1>

                    <button type="button" className="chat-list__menu-button" aria-label="채팅 메뉴 열기">
                        <img src={menu_icon} alt="" className="chat-list__menu-icon"/>
                    </button>
                </header>

                <main className="chat-list__content">
                    <section className="quest-banner">
                        <img src={quest_orb} alt="" className="quest-banner__image"/>

                        <div className="quest-banner__content">
                            <strong className="quest-banner__title">대화하며 인연을 이어가 보세요</strong>

                            <p className="quest-banner__description">퀘스트를 통해 서로를 알아가요</p>
                        </div>

                        <span className="quest-banner__badge">진행 중 2/3</span>
                    </section>

                    <h2 className="chat-list__count">나의 인연 {chatData.length}</h2>

                    <section className="chat-list__items">
                        {chatData.map((chat) => (
                            <button type="button" className="chat-item" key={chat.id}>
                                <div className="chat-item__profile-wrap">
                                    <img src={chat.profileImage} alt={`${chat.name} 프로필`} className="chat-item__profile"/>

                                    <span className="chat-item__profile-text">{chat.profileText}</span>
                                </div>

                                <div className="chat-item__content">
                                    <div className="chat-item__top">
                                        <div className="chat-item__name-area">
                                            <strong className="chat-item__name">{chat.name}</strong>

                                            {chat.quest && (
                                                <span className={`chat-item__quest chat-item__quest--${chat.questStatus}`}>{chat.quest}</span>
                                            )}
                                        </div>

                                        <span className="chat-item__time">{chat.time}</span>
                                    </div>

                                    <div className="chat-item__bottom">
                                        <p className="chat-item__message">{chat.message}</p>

                                        {chat.unread > 0 && (
                                            <span className="chat-item__unread">{chat.unread}</span>
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