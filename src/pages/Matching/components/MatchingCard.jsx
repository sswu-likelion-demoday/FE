import "./MatchingCard.scss";

const MatchingCard = ({
  title,
  description,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      className="matching_card"
      disabled={disabled}
      onClick={onClick}
    >
      <div className="matching_card_text">
        <p className="matching_card_title">{title}</p>
        <p className="matching_card_description">
          {description}
        </p>
      </div>

      <span className="matching_card_arrow">›</span>
    </button>
  );
};

export default MatchingCard;
