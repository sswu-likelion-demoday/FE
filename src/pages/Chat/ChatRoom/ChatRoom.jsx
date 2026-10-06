import './ChatRoom.scss';
import BottomNav from '../../../components/BottomNav/BottomNav';

import arrow_left from '../../../assets/images/Chat/arrow_left.svg';
import menu_icon from '../../../assets/images/Chat/menu_icon.svg';
import quest_orb from '../../../assets/images/Chat/quest_orb.svg';
import profile_purple from '../../../assets/images/Chat/profile_purple.svg';
import lock_icon from '../../../assets/images/Chat/lock_icon.svg';
import arrow from '../../../assets/images/Chat/arrow.svg';
import plus_icon from '../../../assets/images/Chat/plus_icon.svg';


const ChatRoom = () => {
    return (
        <div className="page">
            <div className="chat-room">
                <header className="chat-room__header">
                    <button type="button" className="chat-room__back-button">
                        <img src={arrow_left} alt="뒤로가기" />
                    </button>

                    <div className="chat-room__user">
                        <img src={profile_purple} alt="달빛여우 프로필" className="chat-room__profile" />
                    </div>
                    <strong className="chat-room__name">달빛여우</strong>
                    <button type="button" className="chat-list__menu-button" aria-label="채팅 메뉴 열기">
                        <img src={menu_icon} alt="" className="chat-list__menu-icon" />
                    </button>
                </header>
                <main className="chat-room__content">
                    <section className="chat-room__box">
                        <div className="chat-room__status">2단계</div>
                        <div className="chat-room__status-message">알아가는 중</div>
                        <div className="chat-room__quest">퀘스트 2/4</div>
                        <img src={arrow_right} alt="" className="chat-room__arrow-right" />
                        <div className="chat-room__bar"></div>
                    </section>
                </main>
            </div>

            <div>
                <BottomNav />

            </div>
            )
}

            export default ChatRoom
