import { useNavigate } from "react-router-dom";
import MypageHeader from "./MypageHeader";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import "./MatchingEditLayout.scss";

const MatchingEditLayout = ({
  className = "",
  title,
  heading,
  description,
  selectedCount,
  children,
  onSave,
  disabled = false,
  footerText = "변경한 내용은 다음 매칭부터 반영돼요",
}) => {
  const navigate = useNavigate();

  return (
    <div className={`page MatchingEditLayout_wrap ${className}`}>
      <div className="matchingedit_header">
        <MypageHeader
          title={title}
          onBack={() => navigate("/mypage/matching-info")}
        />
      </div>

      <div className="matchingedit_main">
        <div className="matchingedit_top">
          <h2>{heading}</h2>
          <div className="matchingedit_count">
            <p>{description}</p>
            {selectedCount !== undefined && (
              <span>{selectedCount}개 선택됨</span>
            )}
          </div>
        </div>

        <div className="matchingedit_options">{children}</div>
      </div>

      <div className="matchingedit_bottom">
        <BottomButton onClick={onSave} disabled={disabled}>
          저장하기
        </BottomButton>
        <p>{footerText}</p>
      </div>
    </div>
  );
};

export default MatchingEditLayout;
