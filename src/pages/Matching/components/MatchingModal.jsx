import "./MatchingModal.scss";

const MatchingModal = ({ text, onCancel, onConfirm }) => {
  return (
    <div className="matching_modal">
      <div className="matching_modal_box">
        <p className="matching_modal_text">{text}</p>
        <div className="matching_modal_btns">
          <button type="button" className="cancel" onClick={onCancel}>
            아니요
          </button>
          <button type="button" className="confirm" onClick={onConfirm}>
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchingModal;
