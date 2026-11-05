import './PointHistoryItem.scss'

const PointHistoryItem = ({ category, title, amount }) => {
  return (
    <div className="PointHistoryItem_wrap">
      <div className="point_history_txt">
        <span>{category}</span>
        <p>{title}</p>
      </div>
      <span className="point_history_amount">
        {amount > 0 ? `+${amount}` : amount}
      </span>
    </div>
  );
};

export default PointHistoryItem;
