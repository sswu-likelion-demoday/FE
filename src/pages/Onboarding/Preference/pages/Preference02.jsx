import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionGroup from "../components/OptionGroup";
import ProgressBar from "../components/ProgressBar";
import BottomButton from "../components/BottomButton";
import "./Preference02.scss";
import prev_btn from "../../../../assets/images/Onboarding/prev_btn.svg";

const Preference02 = () => {
  const navigate = useNavigate();

  const [selectedValues, setSelectedValues] = useState([]);

  const options = [
    { id: 1, label: "먼저 다가가서 말을 거는 편이에요" },
    { id: 2, label: "먼저 다가와주면 편하게 친해져요" },
    { id: 3, label: "대화를 많이 나누며 천천히 가까워져요" },
    { id: 4, label: "깊이 무언가를 함께 공유하면서 친해져요" },
    { id: 5, label: "가벼운 만남부터 시작하는 게 편해요" },
    { id: 6, label: "한 번 친해지면 오래 깊게 지내는 편이에요" },
  ];

  return (
    <div className="page Preference02_wrap">
      <div className="preference02_top">
        <img
          src={prev_btn}
          alt=""
          onClick={() => navigate("/signup/preference01")}
        />
        <ProgressBar currentStep={2} />
        <div className="p02_t_txt">
          <p>
            사람을 만나는 방식은
            <br />
            주로 어떤 편인가요?
          </p>
          <span>최대 2개까지 선택</span>
        </div>
      </div>
      <div className="preference02_main">
        <OptionGroup
          options={options}
          columns={1}
          variant="list"
          selectedValues={selectedValues}
          onChange={setSelectedValues}
          maxSelect={2}
        />
      </div>
      <div className="preference02_bot">
        <BottomButton onClick={() => navigate("/signup/preference03")}>
          다음
        </BottomButton>
      </div>
    </div>
  );
};

export default Preference02;
