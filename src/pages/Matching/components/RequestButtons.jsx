import MatchingButton from "./MatchingButton";

const RequestButtons = ({ className, onAccept, onReject }) => {
  return (
    <div className={className}>
      <MatchingButton
        variant="secondary"
        size="medium"
        icon="check"
        label="수락"
        onClick={onAccept}
      />
      <MatchingButton
        variant="danger"
        size="medium"
        icon="close"
        label="거절"
        onClick={onReject}
      />
    </div>
  );
};

export default RequestButtons;
