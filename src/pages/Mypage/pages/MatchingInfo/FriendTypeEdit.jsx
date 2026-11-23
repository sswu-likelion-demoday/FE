import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateMatchingProfile } from "../../../../api/mypage";
import OptionGroup from "../../../Onboarding/Preference/components/OptionGroup";
import MatchingEditLayout from "../../components/MatchingEditLayout";
import "./FriendTypeEdit.scss";

const friendOptions = [
  { id: 1, label: "편하게 대화할 수 있는 친구" },
  { id: 2, label: "같이 있으면 재미있는 친구" },
  { id: 3, label: "서로 공감하고 배려하는 친구" },
  { id: 4, label: "서로에게 좋은 자극이 되는 친구" },
  { id: 5, label: "취미와 관심사를 함께 즐길 수 있는 친구" },
  { id: 6, label: "새로운 생각과 이야기를 나눌 수 있는 친구" },
  { id: 7, label: "오래 편하게 지낼 수 있는 친구" },
];

const FriendTypeEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialFriendTypeIds = location.state?.friendTypeIds;

  const [selectedValues, setSelectedValues] = useState(
    initialFriendTypeIds ?? [],
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (selectedValues.length < 1 || selectedValues.length > 3 || isSaving) {
      return;
    }

    if (!Array.isArray(initialFriendTypeIds)) {
      alert("기존 친구 유형 정보를 불러오지 못했습니다.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setIsSaving(true);

      await updateMatchingProfile(accessToken, {
        friendTypeIds: selectedValues,
      });

      alert("친구 유형이 수정되었습니다.");
      navigate("/mypage/matching-info");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MatchingEditLayout
      className="FriendTypeEdit_wrap"
      title="만나고 싶은 친구"
      heading={
        <>
          어떤 유형의 친구를
          <br />
          만나고 싶나요?
        </>
      }
      description="최대 3개까지 선택"
      selectedCount={selectedValues.length}
      onSave={handleSave}
      disabled={
        selectedValues.length < 1 || selectedValues.length > 3 || isSaving
      }
    >
      <OptionGroup
        options={friendOptions}
        columns={1}
        variant="list"
        selectedValues={selectedValues}
        onChange={setSelectedValues}
        maxSelect={3}
      />
    </MatchingEditLayout>
  );
};

export default FriendTypeEdit;
