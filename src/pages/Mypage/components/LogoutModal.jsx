import "./LogoutModal.scss";

const LogoutModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="LogoutModal_overlay">
      <div
        className="LogoutModal_wrap"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <p id="logout-modal-title">로그아웃할까요?</p>

        <div className="logoutmodal_buttons">
          <button
            type="button"
            className="logoutmodal_cancel"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="logoutmodal_confirm"
            onClick={onConfirm}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
