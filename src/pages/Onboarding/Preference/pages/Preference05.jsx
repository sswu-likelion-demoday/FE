import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionGroup from "../components/OptionGroup";
import ProgressBar from "../components/ProgressBar";
import BottomButton from "../components/BottomButton";
import "./Preference05.scss";
import prev_btn from "../../../../assets/images/Onboarding/prev_btn.svg";

const Preference05 = () => {
  const navigate = useNavigate();

  const [selectedValues, setSelectedValues] = useState([]);

  const options = [
    { id: 1, label: "편하게 대화할 수 있는 친구" },
    { id: 2, label: "같이 있으면 재미있는 친구" },
    { id: 3, label: "서로 공감하고 배려하는 친구" },
    { id: 4, label: "서로에게 좋은 자극이 되는 친구" },
    { id: 5, label: "취미와 관심사를 함께 즐길 수 있는 친구" },
    { id: 6, label: "새로운 생각과 이야기를 나눌 수 있는 친구" },
    { id: 7, label: "오래 편하게 지낼 수 있는 친구" },
  ];

  return (
    <div className="page Preference05_wrap">
      <div className="preference05_top">
        <img src={prev_btn} alt="" onClick={() => navigate("/signup/preference04")}/>
        <ProgressBar currentStep={5} />
        <div className="p05_t_txt">
          <p>
            어떤 유형의 친구를
            <br />
            만나고 싶나요?
          </p>
          <span>최대 3개까지 선택</span>
        </div>
      </div>
      <div className="preference05_main">
        <OptionGroup
          options={options}
          columns={1}
          variant="list"
          selectedValues={selectedValues}
          onChange={setSelectedValues}
          maxSelect={3}
        />
      </div>
      <div className="preference05_bot">
        <BottomButton onClick={() => navigate("/signup/preference-complete")}>
          완료
        </BottomButton>
      </div>
    </div>
  );
};

export default Preference05;
