import "./NoticeItem.scss";
import next_btn from "../../../assets/images/Mypage/next_btn_2.svg";
import star_white from "../../../assets/images/Mypage/star_white.svg";

const NoticeItem = ({ category, title, date, isPinned = false }) => {
  return (
    <div className={`NoticeItem_wrap ${isPinned ? "pinned" : ""}`}>
      <div className="noticeitem_info">
        <div className="noticeitem_tags">
          {isPinned && (
            <span className="noticeitem_pin">
              <img src={star_white} alt="" /> 고정
            </span>
          )}
          <span
            className={`noticeitem_category ${category === "이벤트" ? "event" : ""}`}
          >
            {category}
          </span>
        </div>

        <p>{title}</p>
        <span className="noticeitem_date">{date}</span>
      </div>

      <img src={next_btn} alt="" className="noticeitem_arrow" />
    </div>
  );
};

export default NoticeItem;
