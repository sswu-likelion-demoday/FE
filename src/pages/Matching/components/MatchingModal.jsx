import "./MatchingModal.scss";

const MatchingModal = ({ text, onCancel, onConfirm, isSubmitting = false }) => {
  return (
    <div className="matching_modal">
      <div className="matching_modal_box" role="dialog" aria-modal="true" aria-label={text} aria-busy={isSubmitting}>
        <p className="matching_modal_text">{text}</p>
        <div className="matching_modal_btns">
          <button type="button" className="cancel" onClick={onCancel} disabled={isSubmitting}>
            아니요
          </button>
          <button type="button" className="confirm" onClick={onConfirm} disabled={isSubmitting}>
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchingModal;
