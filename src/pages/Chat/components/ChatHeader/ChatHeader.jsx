import './ChatHeader.scss';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';
import menu_icon from '../../../../assets/images/Chat/menu_icon.svg';
import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';

const ChatHeader = ({
  onProfileClick,
  currentStage = 1,
  currentQuestNumber = 1,
  isRelationshipComplete = false,
  isRelationshipEnded = false,

  partnerName = '상대방',
  partnerProfileImage = null,
  partnerProfileImageUnlocked = false,
}) => {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const numericChatId = Number(chatId);

  const hasUnlockedProfileImage =
    partnerProfileImageUnlocked === true &&
    partnerProfileImage;

  const profileImage =
    hasUnlockedProfileImage
      ? partnerProfileImage
      : profile_purple;

  const profileText =
    partnerName?.charAt(0) ?? '';

  const handleBack = () => {
    if (isRelationshipComplete) {
      navigate('/chat', {
        state: {
          completedChatId: numericChatId,
        },
      });

      return;
    }

    if (isRelationshipEnded) {
      navigate('/chat', {
        state: {
          endedChatId: numericChatId,
        },
      });

      return;
    }

    navigate('/chat');
  };

  const handleRelationshipClick = () => {
    navigate(
      `/chat/${chatId}/relationship`,
      {
        state: isRelationshipComplete
          ? {
            relationshipComplete: true,
            stage: 4,
            quest: 4,
          }
          : {
            stage: currentStage,
            quest: currentQuestNumber,
            relationshipEnded:
              isRelationshipEnded,
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
        aria-label={`${partnerName} 메뉴 열기`}
      >
        <div className="chat_header_profile_wrap">
          <img
            src={profileImage}
            alt=""
            className="chat_header_profile"
          />

          {!hasUnlockedProfileImage && (
            <span className="chat_header_profile_text">
              {profileText}
            </span>
          )}
        </div>

        <strong className="chat_header_name">
          {partnerName}
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