import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingProfile.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import RequestButtons from "../components/RequestButtons";
import ProfileCard from "../components/ProfileCard";
import MatchingModal from "../components/MatchingModal";

const MatchingProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // 목록에서 넘겨받은 프로필 (바로 들어오면 임시 데이터)
  const profile = location.state || {
    name: "새벽산책",
    studentId: "22",
    description: "사주 궁합이 80점 이상이에요",
    expireText: "2일 후에 만료돼요",
  };

  // 보낸 요청(채팅 요청 후)인지, 받은 요청인지
  const isSent = profile.type === "sent";

  let title = "나와 잘 맞을 수 있는\n수정이 찾아왔어요!";
  let message = "상대방이 수락을 기다리고 있어요";

  if (isSent) {
    title = "부족한 기운을 채워줄\n수정을 찾았어요!";
    message = "상대방의 수락을 기다리고 있어요";
  }

  return (
    <div className="page MatchingProfile_wrap">
      <MatchingHeader title="프로필" />
      <div className="matchingprofile_main">
        <ProfileCard
          title={title}
          nickname={profile.name}
          studentId={profile.studentId}
          description={profile.description}
        />
        <p className="profile_card_message">{message}</p>
      </div>
      {isSent ? (
        <div className="matchingprofile_bot sent">
          <div className="mp_b_wait">수락 대기 중</div>
          <p className="mp_b_cancel" onClick={() => setShowModal(true)}>
            매칭 취소
          </p>
        </div>
      ) : (
        <div className="matchingprofile_bot">
          <RequestButtons className="mp_b_btns" />
          <p className="mp_b_expire">{profile.expireText}</p>
        </div>
      )}
      <BottomNav initialMenu="matching" />
      {showModal && (
        <MatchingModal
          text="정말 취소하시겠어요?"
          onCancel={() => setShowModal(false)}
          onConfirm={() => navigate("/matching/request")}
        />
      )}
    </div>
  );
};

export default MatchingProfile;
