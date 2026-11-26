import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { acceptMatchRequest, cancelMatchRequest, createMatchRequest, getMatchRequestDetail, rejectMatchRequest } from "../../../api/matching";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const [detailState, setDetailState] = useState({ requestId: null, data: null, error: "" });
  const [retry, setRetry] = useState(0);
  const [now, setNow] = useState(Date.now);

  const isFound = location.state?.type === "found";
  const requestId = location.state?.requestId;

  useEffect(() => {
    setShowModal(false);
    if (isFound || !requestId) return;
    let active = true;
    setDetailState({ requestId, data: null, error: "" });
    getMatchRequestDetail(requestId)
      .then((data) => {
        if (active) {
          setDetailState({ requestId, data, error: "" });
          setNow(Date.now());
        }
      })
      .catch((error) => {
        if (active) setDetailState({ requestId, data: null, error: error.message });
      });
    return () => { active = false; };
  }, [isFound, requestId, location.key, retry]);

  const detail = !isFound && detailState.requestId === requestId ? detailState.data : null;
  const loadError = !requestId
    ? "요청 정보가 없습니다. 요청 목록에서 프로필을 다시 선택해 주세요."
    : detailState.requestId === requestId ? detailState.error : "";
  const expiresAt = detail?.expiresAt ? Date.parse(detail.expiresAt) : null;
  const expired = expiresAt !== null && expiresAt <= now;
  const isPending = detail?.status === "PENDING" && !expired;

  useEffect(() => {
    if (!isPending || expiresAt === null) return;
    const timer = window.setTimeout(
      () => setNow(Date.now()),
      Math.min(Math.max(0, expiresAt - Date.now()), 2147483647),
    );
    return () => window.clearTimeout(timer);
  }, [isPending, expiresAt, now]);

  // 추천 프로필은 추천 결과를, 보낸/받은 요청 프로필은 상세 API 응답을 사용
  const profile = isFound ? location.state : detail ? {
    requestId: detail.requestId,
    type: detail.direction === "SENT" ? "sent" : "received",
    name: detail.user.nickname,
    studentId: detail.user.admissionYear,
    profileImageUrl: detail.user.profileImageUrl,
    saju: detail.matchingType === "SAJU",
    compatibilityScore: detail.matchingType === "SAJU" ? detail.compatibilityScore : null,
    expireText: expiresAt !== null && !expired
      ? `${Math.ceil((expiresAt - now) / 86400000)}일 후에 만료돼요`
      : "",
  } : null;

  // 보낸 요청(채팅 요청 후) / 매칭으로 찾은 사람 / 받은 요청
  const isSent = profile?.type === "sent";
  const isReceived = profile?.type === "received";
  const backToRequests = () => navigate("/matching/request", {
    state: { tab: isSent || (!detail && location.state?.type === "sent") ? "sent" : "received" },
  });

  const handleRequest = async (action) => {
    if (submitting.current) return;
    const canHandleRequest = action === "send"
      ? isFound && profile?.recommendationId
      : profile?.requestId && isPending && (action === "cancel" ? isSent : isReceived);
    if (!canHandleRequest) {
      alert("요청 정보를 확인할 수 없습니다. 매칭 화면에서 다시 시도해 주세요.");
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    try {
      if (action === "send") {
        const request = await createMatchRequest(profile.recommendationId);
        navigate("/matching/request/profile", {
          state: { ...profile, type: "sent", requestId: request.requestId },
          replace: true,
        });
      } else if (action === "cancel") {
        await cancelMatchRequest(profile.requestId);
        setShowModal(false);
        navigate("/matching/request", { state: { tab: "sent" }, replace: true });
      } else if (action === "accept") {
        await acceptMatchRequest(profile.requestId);
        navigate("/matching");
      } else {
        await rejectMatchRequest(profile.requestId);
        navigate("/matching/request", { replace: true });
      }
    } catch (err) {
      alert(err.message);
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  let title = "나와 잘 맞을 수 있는\n수정이 찾아왔어요!";
  let message = "상대방이 수락을 기다리고 있어요";

  if (isSent) {
    title = profile.saju
      ? "부족한 기운을 채워줄\n수정을 찾았어요!"
      : "함께 즐길 수 있는 것이\n많은 수정이에요";
    message = "상대방의 수락을 기다리고 있어요";
  }

  if (isFound) {
    title = "함께 즐길 수 있는 것이\n많은 수정이에요";
    message = "더 알아보고 싶다면 채팅을 시작해보세요";
  }

  if (isFound && profile.saju) {
    title = "부족한 기운을 채워줄\n수정을 찾았어요!";
  }

  if (detail && !isPending) {
    const statusMessages = {
      ACCEPTED: "수락이 완료된 요청이에요",
      REJECTED: "거절된 요청이에요",
      CANCELED: "취소된 요청이에요",
      EXPIRED: "만료된 요청이에요",
    };
    message = expired && detail.status === "PENDING"
      ? statusMessages.EXPIRED
      : statusMessages[detail.status] || "처리가 완료된 요청이에요";
  }

  return (
    <div className="page MatchingProfile_wrap">
      <MatchingHeader
        title="프로필"
        showBack={!isFound}
        onBack={backToRequests}
      />
      <div className={isFound ? "matchingprofile_main found" : "matchingprofile_main"}>
        {profile ? (
          <>
            <ProfileCard
              title={title}
              nickname={profile.name}
              studentId={profile.studentId}
              description={profile.description}
              profileImageUrl={profile.profileImageUrl}
              compatibilityScore={profile.compatibilityScore}
            />
            <p className="profile_card_message">{message}</p>
          </>
        ) : loadError ? (
          <>
            <p role="alert">{loadError}</p>
            {requestId && <button type="button" onClick={() => setRetry((value) => value + 1)}>다시 시도</button>}
          </>
        ) : <p role="status">프로필을 불러오고 있어요.</p>}
      </div>
      {isSent && isPending && (
        <div className="matchingprofile_bot sent">
          <div className="mp_b_wait">수락 대기 중</div>
          <button type="button" className="mp_b_link" onClick={() => setShowModal(true)} disabled={isSubmitting}>
            매칭 취소
          </button>
        </div>
      )}
      {isFound && (
        <div className="matchingprofile_bot found">
          {/* 채팅 요청 후 같은 프로필을 '수락 대기 중' 화면으로 보여줌 */}
          <BottomButton
            disabled={isSubmitting}
            onClick={() => handleRequest("send")}
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
      {isReceived && isPending && (
        <div className="matchingprofile_bot">
          <RequestButtons
            className="mp_b_btns"
            disabled={isSubmitting}
            onAccept={() => handleRequest("accept")}
            onReject={() => handleRequest("reject")}
          />
          <p className="mp_b_expire">{profile.expireText}</p>
        </div>
      )}
      {!isFound && ((detail && !isPending) || (!requestId)) && (
        <div className="matchingprofile_bot">
          <BottomButton onClick={backToRequests}>요청 목록 보기</BottomButton>
        </div>
      )}
      <BottomNav initialMenu="matching" />
      {showModal && isSent && isPending && (
        <MatchingModal
          text="정말 취소하시겠어요?"
          isSubmitting={isSubmitting}
          onCancel={() => setShowModal(false)}
          onConfirm={() => handleRequest("cancel")}
        />
      )}
    </div>
  );
};

export default MatchingProfile;
