import "./BlockedUserItem.scss";

const BlockedUserItem = ({ nickname, blockedDate, onUnblock }) => {
  return (
    <div className="BlockedUserItem_wrap">
      <div className="blockeduseritem_info">
        <p>{nickname}</p>
        <span>{blockedDate} 차단</span>
      </div>
      <button type="button" onClick={onUnblock}>
        해제
      </button>
    </div>
  );
};

export default BlockedUserItem;
