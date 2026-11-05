import './MessageBubble.scss';

import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';

const MessageBubble = ({ type, message, time }) => {
    const isMine = type === 'mine';

    return (
        <div className={`message_bubble ${isMine ? 'mine' : 'other'}`}>
            {!isMine && (
                <div className="message_profile_wrap">
                    <img
                        src={profile_purple}
                        alt="달빛여우 프로필"
                        className="message_profile"
                    />
                </div>
            )}

            <div className="message_content">
                {isMine && (
                    <span className="message_time">
                        {time}
                    </span>
                )}

                <p className="message_text">
                    {message}
                </p>

                {!isMine && (
                    <span className="message_time">
                        {time}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;