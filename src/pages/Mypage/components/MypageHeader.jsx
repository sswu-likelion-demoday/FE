import { useNavigate } from "react-router-dom";
import prev_btn from "../../../assets/images/Mypage/prev_btn.svg";
import "./MypageHeader.scss";

const MypageHeader = ({ title, onBack }) => {
  const navigate = useNavigate();

  return (
    <header className="MypageHeader_wrap">
      <button
        type="button"
        onClick={onBack || (() => navigate(-1))}
        aria-label="뒤로 가기"
      >
        <img src={prev_btn} alt="" />
      </button>
      <p>{title}</p>
    </header>
  );
};

export default MypageHeader;
