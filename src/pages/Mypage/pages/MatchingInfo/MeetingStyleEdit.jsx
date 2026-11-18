import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionGroup from "../../../Onboarding/Preference/components/OptionGroup";
import MatchingEditLayout from "../../components/MatchingEditLayout";
import "./MeetingStyleEdit.scss";

const meetingOptions = [
  { id: 1, label: "먼저 다가가서 말을 거는 편이에요" },
  { id: 2, label: "먼저 다가와주면 편하게 친해져요" },
  { id: 3, label: "대화를 많이 나누며 천천히 가까워져요" },
  { id: 4, label: "같이 무언가를 하면서 자연스럽게 친해져요" },
  { id: 5, label: "가벼운 만남부터 시작하는 게 편해요" },
  { id: 6, label: "한 번 친해지면 오래 깊게 지내는 편이에요" },
];

const MeetingStyleEdit = () => {
  const navigate = useNavigate();
  const [selectedValues, setSelectedValues] = useState([3, 6]);

  return (
    <MatchingEditLayout
      className="MeetingStyleEdit_wrap"
      title="사람을 만나는 방식"
      heading={
        <>
          사람을 만나는 방식은
          <br />
          주로 어떤 편인가요?
        </>
      }
      description="최대 2개까지 선택"
      selectedCount={selectedValues.length}
      onSave={() => navigate("/mypage/matching-info")}
    >
      <OptionGroup
        options={meetingOptions}
        columns={1}
        variant="list"
        selectedValues={selectedValues}
        onChange={setSelectedValues}
        maxSelect={2}
      />
    </MatchingEditLayout>
  );
};

export default MeetingStyleEdit;
