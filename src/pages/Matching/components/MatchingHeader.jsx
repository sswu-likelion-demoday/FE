import { useNavigate } from "react-router-dom";
import backArrow from "../../../assets/images/Matching/header_back.svg";
import "./MatchingHeader.scss";

const MatchingHeader = ({
  title = "매칭",
  showBack = true,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="matching_header">
      {showBack && (
        <button
          type="button"
          className="matching_header_back"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <img src={backArrow} alt="" />
        </button>
      )}

      <h1 className="matching_header_title">
        {title}
      </h1>
    </header>
  );
};

export default MatchingHeader;
