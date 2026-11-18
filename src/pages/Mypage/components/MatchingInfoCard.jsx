import "./MatchingInfoCard.scss";
import next_btn from "../../../assets/images/Mypage/next_btn.svg";

const MatchingInfoCard = ({
  title,
  description,
  items,
  isMbti = false,
  onEdit,
}) => {
  return (
    <div className="mi_card" onClick={onEdit}>
      <div className="mi_card_top">
        <div className="mi_card_info">
          <span className="mi_card_title">{title}</span>
          {description && <span className="mi_card_desc">{description}</span>}
        </div>

        <button type="button" className="mi_card_edit">
          수정 <img src={next_btn} alt="" />
        </button>
      </div>

      <div className={`mi_card_items ${isMbti ? "mbti" : ""}`}>
        {items.map((item, index) => (
          <div className="mi_card_item" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingInfoCard;
