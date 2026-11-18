import './QuestCard.scss';

import quest_orb from '../../../../assets/images/Chat/quest_orb.svg';
import star from '../../../../assets/images/Chat/star.svg';

const QuestCard = ({
  label = '새 퀘스트가 열렸어요',
  title,
  description,
  subDescription,
  primaryText = '퀘스트 보기',
  secondaryText = '나중에',
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <div className="quest_card">
      <div className="quest_card_label">
        <img
          src={star}
          alt=""
          className="quest_card_star"
        />

        <span>{label}</span>
      </div>

      <div className="quest_card_content">
        <img
          src={quest_orb}
          alt=""
          className="quest_card_logo"
        />

        <div className="quest_card_text">
          <strong className="quest_card_title">
            {title}
          </strong>

          <p className="quest_card_description">
            {description}
          </p>

          <p className="quest_card_sub">
            {subDescription}
          </p>
        </div>
      </div>

      <div className="quest_card_buttons">
        <button
          type="button"
          className="quest_card_button quest_card_button_secondary"
          onClick={onSecondaryClick}
        >
          {secondaryText}
        </button>

        <button
          type="button"
          className="quest_card_button quest_card_button_primary"
          onClick={onPrimaryClick}
        >
          {primaryText}
        </button>
      </div>
    </div>
  );
};

export default QuestCard;