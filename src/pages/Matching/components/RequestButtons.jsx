import MatchingButton from "./MatchingButton";

const RequestButtons = ({ className, onAccept, onReject, disabled = false }) => {
  return (
    <div className={className}>
      <MatchingButton
        variant="secondary"
        size="medium"
        icon="check"
        label="수락"
        disabled={disabled}
        onClick={onAccept}
      />
      <MatchingButton
        variant="danger"
        size="medium"
        icon="close"
        label="거절"
        disabled={disabled}
        onClick={onReject}
      />
    </div>
  );
};

export default RequestButtons;
