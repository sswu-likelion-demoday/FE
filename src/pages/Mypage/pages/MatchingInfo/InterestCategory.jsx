import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionGroup from "../../../Onboarding/Preference/components/OptionGroup";
import BottomButton from "../../../Onboarding/Preference/components/BottomButton";
import "./InterestCategory.scss";
import prev_btn from "../../../../assets/images/Mypage/prev_btn.svg";

const categoryOptions = [
  { id: 1, label: "예술·전시" },
  { id: 2, label: "영화·드라마" },
  { id: 3, label: "음악·공연" },
  { id: 4, label: "여행" },
  { id: 5, label: "맛집·카페" },
  { id: 6, label: "패션·뷰티" },
  { id: 7, label: "책·글쓰기" },
  { id: 8, label: "IT·테크" },
  { id: 9, label: "경제·재테크" },
  { id: 10, label: "동물" },
  { id: 11, label: "게임" },
  { id: 12, label: "자기계발" },
  { id: 13, label: "요리·베이킹" },
  { id: 14, label: "스포츠" },
  { id: 15, label: "취업·커리어" },
];

const InterestCategory = () => {
  const navigate = useNavigate();
  const [selectedValues, setSelectedValues] = useState([1, 3, 5, 14]);

  return (
    <div className="page InterestCategory_wrap">
      <div className="interestcategory_header">
        <img
          src={prev_btn}
          alt=""
          onClick={() => navigate("/mypage/matching-info")}
        />
        <h1>관심 카테고리</h1>
      </div>

      <div className="interestcategory_main">
        <div className="i_m_top">
          <h2>
            관심있는 카테고리를
            <br />
            선택해 주세요
          </h2>
          <div className="interestcategory_count">
            <p>최소 3개 이상 선택</p>
            <span>{selectedValues.length}개 선택됨</span>
          </div>
        </div>

        <div className="interestcategory_options">
          <OptionGroup
            options={categoryOptions}
            columns={3}
            variant="grid"
            selectedValues={selectedValues}
            onChange={setSelectedValues}
          />
        </div>
      </div>

      <div className="interestcategory_bottom">
        <BottomButton
          onClick={() => navigate("/mypage/matching-info")}
          disabled={selectedValues.length < 3}
        >
          저장하기
        </BottomButton>
        <p>변경한 관심사는 다음 매칭부터 반영돼요</p>
      </div>
    </div>
  );
};

export default InterestCategory;
