import "./UnblockModal.scss";

const UnblockModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="UnblockModal_overlay">
      <div
        className="UnblockModal_wrap"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unblock-modal-title"
      >
        <p id="unblock-modal-title">차단을 해제할까요?</p>

        <div className="unblockmodal_buttons">
          <button
            type="button"
            className="unblockmodal_cancel"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="unblockmodal_confirm"
            onClick={onConfirm}
          >
            해제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnblockModal;
