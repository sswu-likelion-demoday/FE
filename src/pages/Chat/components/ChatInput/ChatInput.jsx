import './ChatInput.scss';

import plus_icon from '../../../../assets/images/Chat/plus_icon.svg';
import arrow from '../../../../assets/images/Chat/arrow.svg';

const ChatInput = () => {
  return (
    <div className="chat_input">
      <button
        type="button"
        className="chat_input_plus"
        aria-label="추가"
      >
        <img src={plus_icon} alt="" />
      </button>

      <input
        type="text"
        className="chat_input_field"
        placeholder="메시지 보내기"
      />

      <button
        type="button"
        className="chat_input_send"
        aria-label="메시지 전송"
      >
        <img src={arrow} alt="" />
      </button>
    </div>
  );
};

export default ChatInput;