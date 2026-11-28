import "./PointHistoryItem.scss";

const PointHistoryItem = ({ category, title, amount, type }) => {
  return (
    <div className="PointHistoryItem_wrap">
      <div className="point_history_txt">
        <span>{category}</span>
        <p>{title}</p>
      </div>
      <span className="point_history_amount">
        {type === "USE" ? `-${Math.abs(amount)}` : `+${Math.abs(amount)}`}
      </span>
    </div>
  );
};

export default PointHistoryItem;
