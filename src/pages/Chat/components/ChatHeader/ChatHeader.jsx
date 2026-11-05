import './ChatHeader.scss';

import { useNavigate } from 'react-router-dom';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';
import menu_icon from '../../../../assets/images/Chat/menu_icon.svg';
import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';

const ChatHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="chat_header">
      <button
        type="button"
        className="chat_header_back"
        onClick={() => navigate('/chat')}
        aria-label="채팅 목록으로 돌아가기"
      >
        <img src={arrow_left} alt="" />
      </button>

      <button
        type="button"
        className="chat_header_user"
        onClick={() => navigate('/chat/1/profile')}
      >
        <div className="chat_header_profile_wrap">
          <img
            src={profile_purple}
            alt=""
            className="chat_header_profile"
          />

          <span className="chat_header_profile_text">
            달
          </span>
        </div>

        <strong className="chat_header_name">
          달빛여우
        </strong>
      </button>

      <button
        type="button"
        className="chat_header_menu"
        aria-label="채팅 메뉴 열기"
      >
        <img src={menu_icon} alt="" />
      </button>
    </header>
  );
};

export default ChatHeader;