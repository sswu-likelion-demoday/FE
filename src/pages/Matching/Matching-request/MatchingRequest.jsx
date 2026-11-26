import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { acceptMatchRequest, getMatchRequests, rejectMatchRequest } from "../../../api/matching";
import { getVisibleMatchRequests } from "../data/requestData";
import "./MatchingRequest.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import RequestButtons from "../components/RequestButtons";
import matching_mascot from "../../../assets/images/Matching/matching_mascot.svg";
import no_matching from "../../../assets/images/Matching/no_matching.svg";
import name_arrow from "../../../assets/images/Matching/name_arrow.svg";
import profile_purple from "../../../assets/images/Chat/profile_purple.svg";

const toProfile = (item, received, now) => {
  const days = item.expiresAt
    ? Math.max(0, Math.ceil((Date.parse(item.expiresAt) - now) / 86400000))
    : null;
  const accepted = item.status === "ACCEPTED";
  return {
    id: item.requestId,
    requestId: item.requestId,
    userId: item.user.userId,
    name: item.user.nickname,
    profileImage: profile_purple,
    profileText: Array.from(item.user.nickname || "")[0],
    accepted,
    chatId: item.chatRoomId,
    expire: received ? `만료 ${days}일전` : accepted ? "수락 완료" : "수락 대기 중",
    expireText: days === null ? "" : `${days}일 후에 만료돼요`,
    studentId: "",
    description: "",
  };
};

const MatchingRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 채팅 요청 후 넘어오면 '보낸 요청' 탭부터 보여줌
  const [tab, setTab] = useState(location.state?.tab ?? "received");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now);
  const submitting = useRef(false);
  const loadVersion = useRef(0);

  useEffect(() => {
    let active = true;
    const loadRequests = async () => {
      if (submitting.current) return;
      const version = ++loadVersion.current;
      setNow(Date.now());
      try {
        const result = await getMatchRequests();
        if (active && version === loadVersion.current) {
          setData(result);
          setNow(Date.now());
          setError("");
        }
      } catch (err) {
        if (active && version === loadVersion.current) setError(err.message);
      }
    };
    const refresh = () => {
      if (document.visibilityState !== "hidden") loadRequests();
    };
    loadRequests();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const interval = window.setInterval(refresh, 15000);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [location.key]);

  useEffect(() => {
    const expiries = [...(data?.receivedRequests ?? []), ...(data?.sentRequests ?? [])]
      .filter((item) => item.status === "PENDING")
      .map((item) => Date.parse(item.expiresAt))
      .filter((expiry) => expiry > now);
    if (expiries.length === 0) return;
    const nextExpiry = Math.min(...expiries);
    const timer = window.setTimeout(
      () => setNow(Date.now()),
      Math.min(Math.max(0, nextExpiry - Date.now()), 2147483647),
    );
    return () => window.clearTimeout(timer);
  }, [data, now]);

  const visibleRequests = getVisibleMatchRequests(data, now);
  const receivedData = visibleRequests.receivedRequests.map((item) => toProfile(item, true, now));
  const sentData = visibleRequests.sentRequests.map((item) => toProfile(item, false, now));
  const slots = data?.relationshipSlots;

  const handleRequest = async (requestId, accept) => {
    if (submitting.current) return;
    submitting.current = true;
    // 수락/거절 전에 시작한 조회 응답이 변경 후 목록을 덮어쓰지 않도록 무효화
    loadVersion.current += 1;
    setIsSubmitting(true);
    setError("");
    try {
      if (accept) {
        await acceptMatchRequest(requestId);
        // 관계 확정 후 첫 화면에서 서버의 남은 슬롯 수를 다시 조회
        navigate("/matching");
      } else {
        await rejectMatchRequest(requestId);
        setData((current) => ({
          ...current,
          receivedRequests: current.receivedRequests.filter((item) => item.requestId !== requestId),
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  // 보낸 요청도 상태에 관계없이 상세 API로 상대 프로필을 확인
  const handleSentClick = (item) => {
    navigate("/matching/request/profile", { state: { ...item, type: "sent" } });
  };

  return (
    <div className="page MatchingRequest_wrap">
      <MatchingHeader title="수정구" onBack={() => navigate("/matching")} />
      <div className="matchingrequest_top">
        {slots && Array.from({ length: slots.total }, (_, index) =>
          index < slots.used ? (
            <div key={index} className="mr_t_slot">
              <img src={matching_mascot} alt="" />
            </div>
          ) : (
            <div key={index} className="mr_t_slot empty">
              <img src={no_matching} alt="" />
            </div>
          ),
        )}
      </div>
      <div className="matchingrequest_tab">
        <button
          type="button"
          className={tab === "received" ? "active" : ""}
          onClick={() => setTab("received")}
        >
          받은 요청 {data ? receivedData.length : "…"}
        </button>
        <button
          type="button"
          className={tab === "sent" ? "active" : ""}
          onClick={() => setTab("sent")}
        >
          보낸 요청 {data ? sentData.length : "…"}
        </button>
      </div>
      <div className="matchingrequest_main">
        {error && <p role="alert">{error}</p>}
        {!data && !error && <p role="status">요청을 불러오고 있어요.</p>}
        {data && (tab === "received" ? receivedData : sentData).length === 0 && (
          <p>{tab === "received" ? "받은 요청이 없어요." : "보낸 요청이 없어요."}</p>
        )}
        {tab === "received" &&
          receivedData.map((item) => (
            <div key={item.id} className="mr_m_item">
              <div
                className="mr_m_profile"
                onClick={() =>
                  navigate("/matching/request/profile", { state: { ...item, type: "received" } })
                }
              >
                <img src={item.profileImage} alt="" />
                <span>{item.profileText}</span>
              </div>
              <div className="mr_m_info">
                <div className="mr_m_top">
                  <p
                    className="mr_m_name"
                    onClick={() =>
                      navigate("/matching/request/profile", { state: { ...item, type: "received" } })
                    }
                  >
                    {item.name}
                    <img src={name_arrow} alt="" className="mr_m_arrow" />
                  </p>
                  <p className="mr_m_expire">{item.expire}</p>
                </div>
                <RequestButtons
                  className="mr_m_btns"
                  disabled={isSubmitting}
                  onAccept={() => handleRequest(item.requestId, true)}
                  onReject={() => handleRequest(item.requestId, false)}
                />
              </div>
            </div>
          ))}

        {tab === "sent" &&
          sentData.map((item) => (
            <div key={item.id} className="mr_m_item">
              <div
                className="mr_m_profile"
                onClick={() => handleSentClick(item)}
              >
                <img src={item.profileImage} alt="" />
                <span>{item.profileText}</span>
              </div>
              <div className="mr_m_info">
                <div className="mr_m_top">
                  <p
                    className="mr_m_name"
                    onClick={() => handleSentClick(item)}
                  >
                    {item.name}
                    <img src={name_arrow} alt="" className="mr_m_arrow" />
                  </p>
                  {item.accepted && (
                    <button
                      type="button"
                      className="mr_m_chat"
                      onClick={() => navigate(`/chat/${item.chatId}`)}
                    >
                      채팅 시작
                    </button>
                  )}
                  <p className={`mr_m_expire ${item.accepted ? "accepted" : ""}`}>
                    {item.expire}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingRequest;
