import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionGroup from "../components/OptionGroup";
import ProgressBar from "../components/ProgressBar";
import BottomButton from "../components/BottomButton";
import "./Preference04.scss";
import prev_btn from "../../../../assets/images/Onboarding/prev_btn.svg";

const Preference04 = () => {
  const navigate = useNavigate();

  const [selectedValues, setSelectedValues] = useState([]);

  const options = [
    { id: 1, label: "카페탐방" },
    { id: 2, label: "맛집탐방" },
    { id: 3, label: "러닝" },
    { id: 4, label: "독서" },
    { id: 5, label: "여행" },
    { id: 6, label: "게임" },
    { id: 7, label: "요리·베이킹" },
    { id: 8, label: "그림·공예" },
    { id: 9, label: "전시·미술관 방문" },
    { id: 10, label: "음악" },
    { id: 11, label: "산책" },
    { id: 12, label: "운동·헬스" },
    { id: 13, label: "보드게임" },
    { id: 14, label: "사진촬영" },
    { id: 15, label: "콘텐츠 시청" },
  ];

  return (
    <div className="page Preference04_wrap">
      <div className="preference04_top">
        <img
          src={prev_btn}
          alt=""
          onClick={() => navigate("/signup/preference03")}
        />
        <ProgressBar currentStep={4} />
        <div className="p04_t_txt">
          <p>
            즐겨하는 취미를
            <br />
            선택해 주세요
          </p>
          <span>최소 3개 ~ 최대 5개 선택</span>
        </div>
      </div>
      <div className="preference04_main">
        <OptionGroup
          options={options}
          columns={3}
          variant="grid"
          selectedValues={selectedValues}
          onChange={setSelectedValues}
          maxSelect={5}
        />
      </div>
      <div className="preference04_bot">
        <BottomButton onClick={() => navigate("/signup/preference05")}>
          다음
        </BottomButton>
      </div>
    </div>
  );
};

export default Preference04;
