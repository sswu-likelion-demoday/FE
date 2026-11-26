import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingProfile.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import MatchingHeader from "../components/MatchingHeader";
import ProfileCard from "../components/ProfileCard";
import RequestButtons from "../components/RequestButtons";
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

  // 보낸 요청(채팅 요청 후) / 매칭으로 찾은 사람 / 받은 요청
  const isSent = profile.type === "sent";
  const isFound = profile.type === "found";
  const isReceived = !isSent && !isFound;

  let title = "나와 잘 맞을 수 있는\n수정이 찾아왔어요!";
  let message = "상대방이 수락을 기다리고 있어요";

  if (isSent) {
    title = "부족한 기운을 채워줄\n수정을 찾았어요!";
    message = "상대방의 수락을 기다리고 있어요";
  }

  if (isFound) {
    title = "함께 즐길 수 있는 것이\n많은 수정이에요";
    message = "더 알아보고 싶다면 채팅을 시작해보세요";
  }

  if (isFound && profile.saju) {
    title = "부족한 기운을 채워줄\n수정을 찾았어요!";
  }

  return (
    <div className="page MatchingProfile_wrap">
      <MatchingHeader
        title="프로필"
        showBack={!isFound}
        onBack={
          isSent
            ? () => navigate("/matching/request", { state: { tab: "sent" } })
            : undefined
        }
      />
      <div className={isFound ? "matchingprofile_main found" : "matchingprofile_main"}>
        <ProfileCard
          title={title}
          nickname={profile.name}
          studentId={profile.studentId}
          description={profile.description}
        />
        <p className="profile_card_message">{message}</p>
      </div>
      {isSent && (
        <div className="matchingprofile_bot sent">
          <div className="mp_b_wait">수락 대기 중</div>
          <p className="mp_b_link" onClick={() => setShowModal(true)}>
            매칭 취소
          </p>
        </div>
      )}
      {isFound && (
        <div className="matchingprofile_bot found">
          {/* 채팅 요청 후 같은 프로필을 '수락 대기 중' 화면으로 보여줌 */}
          <BottomButton
            onClick={() =>
              navigate("/matching/request/profile", {
                state: { ...profile, type: "sent" },
                replace: true,
              })
            }
          >
            채팅 요청하기
          </BottomButton>
          <p
            className="mp_b_link"
            onClick={() =>
              navigate(
                profile.saju ? "/matching/saju/result" : "/matching/start",
              )
            }
          >
            다른 사람을 더 찾아볼래요
          </p>
        </div>
      )}
      {isReceived && (
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
