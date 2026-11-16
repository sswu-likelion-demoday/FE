import './ChatHeader.scss';

import { useNavigate } from 'react-router-dom';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';
import menu_icon from '../../../../assets/images/Chat/menu_icon.svg';
import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';

const ChatHeader = ({
  onProfileClick,
  currentStage = 1,
  currentQuestNumber = 1,
  isRelationshipComplete = false,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isRelationshipComplete) {
      navigate('/chat', {
        state: {
          completedChatId: 1,
        },
      });

      return;
    }

    navigate('/chat');
  };

  const handleRelationshipClick = () => {
    navigate(
      '/chat/1/relationship',
      {
        state:
          isRelationshipComplete
            ? {
              relationshipComplete:
                true,
              stage: 4,
              quest: 4,
            }
            : {
              stage:
                currentStage,
              quest:
                currentQuestNumber,
            },
      }
    );
  };

  return (
    <header className="chat_header">
      <button
        type="button"
        className="chat_header_back"
        onClick={handleBack}
        aria-label="채팅 목록으로 돌아가기"
      >
        <img
          src={arrow_left}
          alt=""
        />
      </button>

      <button
        type="button"
        className="chat_header_user"
        onClick={onProfileClick}
        aria-label="달빛여우 메뉴 열기"
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
        onClick={
          handleRelationshipClick
        }
        aria-label="관계 단계 보기"
      >
        <img
          src={menu_icon}
          alt=""
        />
      </button>
    </header>
  );
};

export default ChatHeader;