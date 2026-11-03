import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionGroup from "../components/OptionGroup";
import ProgressBar from "../components/ProgressBar";
import BottomButton from "../components/BottomButton";
import "./Preference03.scss";
import prev_btn from "../../../../assets/images/Onboarding/prev_btn.svg";

const Preference03 = () => {
  const navigate = useNavigate();

  const [selectedValues, setSelectedValues] = useState([]);

  const options = [
    { id: 1, label: "예술전시" },
    { id: 2, label: "영화·드라마" },
    { id: 3, label: "음악·공연" },
    { id: 4, label: "여행" },
    { id: 5, label: "맛집·카페" },
    { id: 6, label: "패션·뷰티" },
    { id: 7, label: "책·글쓰기" },
    { id: 8, label: "IT·테크" },
    { id: 9, label: "경제·재태크" },
    { id: 10, label: "동물" },
    { id: 11, label: "게임" },
    { id: 12, label: "스포츠" },
    { id: 13, label: "요리·베이킹" },
    { id: 14, label: "자기계발" },
    { id: 15, label: "취업·커리어" },
  ];

  return (
    <div className="page Preference03_wrap">
      <div className="preference03_top">
        <img
          src={prev_btn}
          alt=""
          onClick={() => navigate("/signup/preference02")}
        />
        <ProgressBar currentStep={3} />
        <div className="p03_t_txt">
          <p>
            관심있는 카테고리를
            <br />
            선택해 주세요
          </p>
          <span>최소 3개 ~ 최대 5개 선택</span>
        </div>
      </div>
      <div className="preference03_main">
        <OptionGroup
          options={options}
          columns={3}
          variant="grid"
          selectedValues={selectedValues}
          onChange={setSelectedValues}
          maxSelect={5}
        />
      </div>
      <div className="preference03_bot">
        <BottomButton onClick={() => navigate("/signup/preference04")}>
          다음
        </BottomButton>
      </div>
    </div>
  );
};

export default Preference03;
