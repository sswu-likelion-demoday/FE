import './ChatMenu.scss';

import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';
import eye from '../../../../assets/images/Chat/eye.svg';
import block from '../../../../assets/images/Chat/block.svg';
import leave from '../../../../assets/images/Chat/leave.svg';

import {
    getRelationshipStage,
} from '../../data/relationshipData';

const ChatMenu = ({
    onClose,
    onProfile,
    onBlock,
    onLeave,
    currentStage = 1,
    isRelationshipComplete = false,
}) => {
    const currentStageData =
        getRelationshipStage(currentStage);

    const stageText =
        isRelationshipComplete
            ? '인연 완료'
            : `${currentStageData.stage}단계 ${currentStageData.stageName}`;

    return (
        <div
            className="chat_menu_overlay"
            onClick={onClose}
        >
            <div
                className="chat_menu"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="chat_menu_handle" />

                <div className="chat_menu_user">
                    <div className="chat_menu_profile_wrap">
                        <img
                            src={profile_purple}
                            alt="달빛여우 프로필"
                            className="chat_menu_profile"
                        />

                        <span>
                            달
                        </span>
                    </div>

                    <div className="chat_menu_user_info">
                        <strong>
                            달빛여우
                        </strong>

                        <span>
                            {stageText}
                        </span>
                    </div>
                </div>

                <div className="chat_menu_divider" />

                <button
                    type="button"
                    className="chat_menu_item"
                    onClick={onProfile}
                >
                    <div className="chat_menu_icon">
                        <img
                            src={eye}
                            alt=""
                        />
                    </div>

                    <div className="chat_menu_item_text">
                        <strong>
                            상대방 프로필 보기
                        </strong>

                        <span>
                            지금까지 해금된 정보를 볼 수 있어요
                        </span>
                    </div>
                </button>

                <button
                    type="button"
                    className="chat_menu_item"
                    onClick={onBlock}
                >
                    <div className="chat_menu_icon chat_menu_icon_danger">
                        <img
                            src={block}
                            alt=""
                        />
                    </div>

                    <div className="chat_menu_item_text">
                        <strong className="chat_menu_danger_text">
                            차단하기
                        </strong>
                    </div>
                </button>

                <button
                    type="button"
                    className="chat_menu_item"
                    onClick={onLeave}
                >
                    <div className="chat_menu_icon chat_menu_icon_danger">
                        <img
                            src={leave}
                            alt=""
                        />
                    </div>

                    <div className="chat_menu_item_text">
                        <strong className="chat_menu_danger_text">
                            채팅방 나가기
                        </strong>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ChatMenu;