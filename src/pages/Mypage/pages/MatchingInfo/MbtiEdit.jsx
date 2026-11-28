import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateMatchingProfile } from "../../../../api/mypage";
import OptionGroup from "../../../Onboarding/Preference/components/OptionGroup";
import MatchingEditLayout from "../../components/MatchingEditLayout";
import "./MbtiEdit.scss";

const mbtiOptions = [
  {
    id: 1,
    label: (
      <>
        <strong>E</strong>
        <span>
          사람들과 함께하며
          <br />
          에너지를 얻어요
        </span>
      </>
    ),
  },
  {
    id: 2,
    label: (
      <>
        <strong>I</strong>
        <span>
          혼자만의 시간으로
          <br />
          에너지를 얻어요
        </span>
      </>
    ),
  },
  {
    id: 3,
    label: (
      <>
        <strong>S</strong>
        <span>
          구체적이고 현실적인
          <br />
          이야기가 좋아요
        </span>
      </>
    ),
  },
  {
    id: 4,
    label: (
      <>
        <strong>N</strong>
        <span>
          새롭고 상상력을 자극하는
          <br />
          이야기가 좋아요
        </span>
      </>
    ),
  },
  {
    id: 5,
    label: (
      <>
        <strong>T</strong>
        <span>
          문제를 해결할
          <br />
          방법을 먼저 생각해요
        </span>
      </>
    ),
  },
  {
    id: 6,
    label: (
      <>
        <strong>F</strong>
        <span>
          상대의 마음을
          <br />
          먼저 생각해요
        </span>
      </>
    ),
  },
  {
    id: 7,
    label: (
      <>
        <strong>J</strong>
        <span>
          미리 계획하고
          <br />
          정해두는 게 편해요
        </span>
      </>
    ),
  },
  {
    id: 8,
    label: (
      <>
        <strong>P</strong>
        <span>
          상황에 따라 유연하게
          <br />
          정하는 게 편해요
        </span>
      </>
    ),
  },
];

const MbtiEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialMbti = location.state?.mbti ?? "";

  const [selectedValues, setSelectedValues] = useState(() =>
    initialMbti
      .split("")
      .map((letter) => "EISNTFJP".indexOf(letter) + 1)
      .filter((id) => id > 0),
  );

  const [isSaving, setIsSaving] = useState(false);

  const mbti = [...selectedValues]
    .sort((a, b) => a - b)
    .map((id) => "EISNTFJP"[id - 1])
    .join("");

  const isValidMbti =
    selectedValues.length === 4 &&
    new Set(selectedValues.map((id) => Math.ceil(id / 2))).size === 4;

  const handleSave = async () => {
    if (!isValidMbti || isSaving) return;

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (mbti === initialMbti) {
      navigate("/mypage/matching-info");
      return;
    }

    try {
      setIsSaving(true);

      await updateMatchingProfile(accessToken, { mbti });

      alert("MBTI가 수정되었습니다.");
      navigate("/mypage/matching-info");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MatchingEditLayout
      className="MbtiEdit_wrap"
      title="나의 성향"
      heading={
        <>
          평소 자신의 모습과
          <br />더 가까운 쪽을 선택해 주세요
        </>
      }
      description={
        <>
          항목마다 하나씩 선택 <span>{mbti}</span>
        </>
      }
      onSave={handleSave}
      disabled={!isValidMbti || isSaving}
      footerText="변경한 성향은 다음 매칭부터 반영돼요"
    >
      <OptionGroup
        options={mbtiOptions}
        columns={2}
        variant="pair"
        selectedValues={selectedValues}
        onChange={setSelectedValues}
        maxSelect={4}
      />
    </MatchingEditLayout>
  );
};

export default MbtiEdit;
