import { useNavigate } from "react-router-dom";
import "./MatchingFound.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import card_matching from "../../../assets/images/Matching/card_matching.svg";

const MatchingFound = () => {
  const navigate = useNavigate();

  // 매칭된 사람 (확인용 임시 데이터)
  const profile = {
    name: "달빛여우",
    studentId: "24",
    description: "같은 취미를 가졌어요",
    type: "found",
  };

  return (
    <div className="page MatchingFound_wrap">
      <MatchingHeader title="매칭" />
      <div className="matchingfound_main">
        <p className="mf_m_title">
          나리님을 위한
          <br />
          수정을 발견했어요!
        </p>
        <div className="mf_m_card">
          <img src={card_matching} alt="" />
        </div>
        <p className="mf_m_question">확인해볼까요?</p>
      </div>
      <div className="matchingfound_bot">
        <BottomButton
          onClick={() =>
            navigate("/matching/request/profile", { state: profile })
          }
        >
          프로필 확인하기
        </BottomButton>
        <p className="mf_b_stop" onClick={() => navigate("/matching")}>
          그만두기
        </p>
      </div>
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingFound;
