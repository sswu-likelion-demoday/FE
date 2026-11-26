import './ChatInput.scss';

import { useState } from 'react';

import plus_icon from '../../../../assets/images/Chat/plus_icon.svg';
import arrow from '../../../../assets/images/Chat/arrow.svg';

const ChatInput = ({
  onSend,
  disabled = false,
}) => {
  const [
    message,
    setMessage,
  ] = useState('');

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      disabled
    ) {
      return;
    }

    const isSent =
      onSend?.(
        trimmedMessage
      );

    /*
     * WebSocket 전송에 실패하면
     * 입력값을 유지한다.
     */
    if (isSent === false) {
      return;
    }

    setMessage('');
  };

  return (
    <form
      className="chat_input"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="chat_input_plus"
        aria-label="추가"
        disabled={disabled}
      >
        <img
          src={plus_icon}
          alt=""
        />
      </button>

      <input
        type="text"
        className="chat_input_field"
        placeholder={
          disabled
            ? '채팅 서버 연결 중...'
            : '메시지 보내기'
        }
        value={message}
        onChange={(event) =>
          setMessage(
            event.target.value
          )
        }
        disabled={disabled}
      />

      <button
        type="submit"
        className="chat_input_send"
        aria-label="메시지 전송"
        disabled={
          disabled ||
          !message.trim()
        }
      >
        <img
          src={arrow}
          alt=""
        />
      </button>
    </form>
  );
};

export default ChatInput;