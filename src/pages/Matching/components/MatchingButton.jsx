import "./MatchingButton.scss";

const MatchingButton = ({
  label,
  variant = "primary",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`matching_btn ${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default MatchingButton;