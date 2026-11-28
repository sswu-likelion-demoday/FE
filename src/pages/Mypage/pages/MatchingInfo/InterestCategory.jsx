import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateMatchingProfile } from "../../../../api/mypage";
import OptionGroup from "../../../Onboarding/Preference/components/OptionGroup";
import MatchingEditLayout from "../../components/MatchingEditLayout";
import "./InterestCategory.scss";

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
  const location = useLocation();

  const initialInterestIds = location.state?.interestIds;

  const [selectedValues, setSelectedValues] = useState(
    initialInterestIds ?? [],
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (selectedValues.length < 3 || selectedValues.length > 5 || isSaving) {
      return;
    }

    if (!Array.isArray(initialInterestIds)) {
      alert("기존 관심사 정보를 불러오지 못했습니다.");
      return;
    }

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setIsSaving(true);

      await updateMatchingProfile(accessToken, {
        interestIds: selectedValues,
      });

      alert("관심 카테고리가 수정되었습니다.");
      navigate("/mypage/matching-info");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MatchingEditLayout
      className="InterestCategory_wrap"
      title="관심 카테고리"
      heading={
        <>
          관심있는 카테고리를
          <br />
          선택해 주세요
        </>
      }
      description="최소 3개 이상 선택"
      selectedCount={selectedValues.length}
      onSave={handleSave}
      disabled={
        selectedValues.length < 3 || selectedValues.length > 5 || isSaving
      }
      footerText="변경한 관심사는 다음 매칭부터 반영돼요"
    >
      <OptionGroup
        options={categoryOptions}
        columns={3}
        variant="grid"
        selectedValues={selectedValues}
        onChange={setSelectedValues}
        maxSelect={5}
      />
    </MatchingEditLayout>
  );
};

export default InterestCategory;
