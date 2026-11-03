import { useNavigate } from "react-router-dom";
import "./PreferenceIntro.scss";
import BottomButton from "./components/BottomButton";
import preferenceIntro_icon from "../../../assets/images/Onboarding/PreferenceIntro_icon.svg";

const PreferenceIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="page PreferenceIntro_wrap">
      <div className="preferenceintro_top">
        <img src={preferenceIntro_icon} alt="" />
      </div>
      <div className="preferenceintro_main">
        <p>매칭 유형 파악</p>
        <span>
          나리님과 잘 맞는
          <br />
          수정이를 찾기 위해
          <br />
          5가지 질문을 준비했어요
        </span>
      </div>
      <div className="preferenceintro_bot">
        <BottomButton onClick={() => navigate("/signup/preference01")}>
          시작하기
        </BottomButton>
      </div>
    </div>
  );
};

export default PreferenceIntro;
