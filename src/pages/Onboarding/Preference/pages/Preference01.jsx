import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OptionGroup from "../components/OptionGroup";
import ProgressBar from "../components/ProgressBar";
import BottomButton from "../components/BottomButton";
import "./Preference01.scss";
import prev_btn from "../../../../assets/images/Onboarding/prev_btn.svg";

const Preference01 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nickname = sessionStorage.getItem("nickname");

  const [selectedValues, setSelectedValues] = useState(
    location.state?.mbtiSelectionIds ?? [],
  );

  const options = [
    { id: 1, label: "사람들과 함께하며\n에너지를 얻어요" },
    { id: 2, label: "혼자만의 시간으로\n에너지를 얻어요" },
    { id: 3, label: "구체적이고 현실적인\n이야기가 좋아요" },
    { id: 4, label: "새롭고 상상력을 자극하는\n이야기가 좋아요" },
    { id: 5, label: "문제를 해결할\n방법을 먼저 생각해요" },
    { id: 6, label: "상대의 마음을\n먼저 생각해요" },
    { id: 7, label: "미리 계획하고\n정해두는 게 편해요" },
    { id: 8, label: "상황에 따라 유연하게\n정하는 게 편해요" },
  ];

  const mbtiMap = {
    1: "E",
    2: "I",
    3: "S",
    4: "N",
    5: "T",
    6: "F",
    7: "J",
    8: "P",
  };

  const canGoNext = selectedValues.length === 4;

  return (
    <div className="page Preference01_wrap">
      <div className="preference01_top">
        <img
          src={prev_btn}
          alt=""
          onClick={() => navigate("/signup/preference-intro")}
        />
        <ProgressBar currentStep={1} />
        <div className="p01_t_txt">
          <p>{nickname ? `${nickname}님은` : "나는"} 어떤 사람인가요?</p>
          <span>
            평소 자신의 모습과
            <br />더 가까운 쪽을 선택해주세요
          </span>
        </div>
      </div>
      <div className="preference01_main">
        <p className={`mbti_e ${selectedValues.includes(1) ? "active" : ""}`}>
          E
        </p>
        <p className={`mbti_i ${selectedValues.includes(2) ? "active" : ""}`}>
          I
        </p>
        <p className={`mbti_s ${selectedValues.includes(3) ? "active" : ""}`}>
          S
        </p>
        <p className={`mbti_n ${selectedValues.includes(4) ? "active" : ""}`}>
          N
        </p>
        <p className={`mbti_t ${selectedValues.includes(5) ? "active" : ""}`}>
          T
        </p>
        <p className={`mbti_f ${selectedValues.includes(6) ? "active" : ""}`}>
          F
        </p>
        <p className={`mbti_j ${selectedValues.includes(7) ? "active" : ""}`}>
          J
        </p>
        <p className={`mbti_p ${selectedValues.includes(8) ? "active" : ""}`}>
          P
        </p>
        <OptionGroup
          options={options}
          columns={2}
          variant="pair"
          selectedValues={selectedValues}
          onChange={setSelectedValues}
        />
      </div>
      <div className="preference01_bot">
        <BottomButton
          disabled={!canGoNext}
          onClick={() => {
            if (!canGoNext) return;

            const mbti = [...selectedValues]
              .sort((a, b) => a - b)
              .map((id) => mbtiMap[id])
              .join("");

            navigate("/signup/preference02", {
              state: {
                ...location.state,
                mbti,
                mbtiSelectionIds: selectedValues,
              },
            });
          }}
        >
          다음
        </BottomButton>
      </div>
    </div>
  );
};

export default Preference01;
