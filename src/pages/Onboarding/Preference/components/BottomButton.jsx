import "./BottomButton.scss";

const BottomButton = ({
  children,
  onClick,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      className="bottom_btn"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default BottomButton;
