import "./ChoiceButton.scss";

const ChoiceButton = ({
  label,
  selected = false,
  onClick,
  variant = "list",
}) => {
  return (
    <button
      type="button"
      className={`choice_btn ${variant} ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <p>{label}</p>
    </button>
  );
};

export default ChoiceButton;
