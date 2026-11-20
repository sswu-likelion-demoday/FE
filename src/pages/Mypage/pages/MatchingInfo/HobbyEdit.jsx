import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionGroup from "../../../Onboarding/Preference/components/OptionGroup";
import MatchingEditLayout from "../../components/MatchingEditLayout";
import "./HobbyEdit.scss";

const hobbyOptions = [
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

const HobbyEdit = () => {
  const navigate = useNavigate();
  const [selectedValues, setSelectedValues] = useState([3, 13, 14]);

  return (
    <MatchingEditLayout
      className="HobbyEdit_wrap"
      title="즐겨하는 취미"
      heading={
        <>
          즐겨하는 취미를
          <br />
          선택해 주세요
        </>
      }
      description="최소 3개 ~ 최대 6개 선택"
      selectedCount={selectedValues.length}
      onSave={() => navigate("/mypage/matching-info")}
      disabled={selectedValues.length < 3}
      footerText="변경한 취미는 다음 매칭부터 반영돼요"
    >
      <OptionGroup
        options={hobbyOptions}
        columns={3}
        variant="grid"
        selectedValues={selectedValues}
        onChange={setSelectedValues}
        maxSelect={6}
      />
    </MatchingEditLayout>
  );
};

export default HobbyEdit;
