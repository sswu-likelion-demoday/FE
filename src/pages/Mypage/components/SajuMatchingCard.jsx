import { useState } from "react";
import "./SajuMatchingCard.scss";
import next_btn from "../../../assets/images/Mypage/next_btn.svg";

const SajuMatchingCard = ({ onEdit, birthDate, birthTime }) => {
  const [isAllowed, setIsAllowed] = useState(true);

  return (
    <div className="SajuMatchingCard_wrap">
      <div className="sajumatchingcard_top">
        <div className="sajumatchingcard_title">
          <p>사주 매칭</p>
          <span>연애도 볼 수 있어요</span>
        </div>
        <button type="button" onClick={onEdit}>
          수정 <img src={next_btn} alt="" />
        </button>
      </div>

      <div className="sajumatchingcard_main">
        <div className="sajumatchingcard_toggle">
          <span>매칭 허용</span>
          <button
            type="button"
            className={`sajumatchingcard_switch ${isAllowed ? "active" : ""}`}
            role="switch"
            aria-label="사주 매칭 허용"
            aria-checked={isAllowed}
            onClick={() => setIsAllowed(!isAllowed)}
          />
        </div>

        <div className="sajumatchingcard_info">
          <span>생년월일</span>
          <p>{birthDate}</p>
        </div>

        <div className="sajumatchingcard_info">
          <span>태어난 시간</span>
          <p>{birthTime}</p>
        </div>
      </div>
    </div>
  );
};

export default SajuMatchingCard;
