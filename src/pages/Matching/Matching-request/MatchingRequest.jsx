import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MatchingRequest.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import RequestButtons from "../components/RequestButtons";
import matching_mascot from "../../../assets/images/Matching/matching_mascot.svg";
import no_matching from "../../../assets/images/Matching/no_matching.svg";
import name_arrow from "../../../assets/images/Matching/name_arrow.svg";
import profile_purple from "../../../assets/images/Chat/profile_purple.svg";
import profile_pink from "../../../assets/images/Chat/profile_pink.svg";

const receivedData = [
  {
    id: 1,
    profileImage: profile_purple,
    profileText: "달",
    name: "달빛여우",
    expire: "만료 2일전",
    studentId: "23",
    description: "사주 궁합이 80점 이상이에요",
    expireText: "2일 후에 만료돼요",
  },
  {
    id: 2,
    profileImage: profile_pink,
    profileText: "고",
    name: "고양이 집사",
    expire: "만료 3일전",
    studentId: "22",
    description: "사주 궁합이 75점 이상이에요",
    expireText: "3일 후에 만료돼요",
  },
];

const sentData = [
  {
    id: 3,
    profileImage: profile_purple,
    profileText: "밤",
    name: "밤양갱",
    expire: "수락 완료",
    accepted: true,
    chatId: 1,
    studentId: "24",
    description: "사주 궁합이 85점 이상이에요",
  },
  {
    id: 4,
    profileImage: profile_purple,
    profileText: "새",
    name: "새벽산책",
    expire: "수락 대기 중",
    accepted: false,
    studentId: "22",
    description: "사주 궁합이 80점 이상이에요",
  },
];

const MatchingRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 채팅 요청 후 넘어오면 '보낸 요청' 탭부터 보여줌
  const [tab, setTab] = useState(location.state?.tab ?? "received");

  // 0이면 꽉 찬 화면, 1 이상이면 빈 수정이 있는 화면
  const emptySlotCount = 1;
  const filledCount = 3 - emptySlotCount;

  // 보낸 요청은 아직 수락 대기 중일 때만 프로필로 이동
  const handleSentClick = (item) => {
    if (item.accepted) return;
    navigate("/matching/request/profile", { state: { ...item, type: "sent" } });
  };

  return (
    <div className="page MatchingRequest_wrap">
      <MatchingHeader title="수정구" onBack={() => navigate("/matching")} />
      <div className="matchingrequest_top">
        {[0, 1, 2].map((index) =>
          index < filledCount ? (
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
          받은 요청 {receivedData.length}
        </button>
        <button
          type="button"
          className={tab === "sent" ? "active" : ""}
          onClick={() => setTab("sent")}
        >
          보낸 요청 {sentData.length}
        </button>
      </div>
      <div className="matchingrequest_main">
        {tab === "received" &&
          receivedData.map((item) => (
            <div key={item.id} className="mr_m_item">
              <div
                className="mr_m_profile"
                onClick={() =>
                  navigate("/matching/request/profile", { state: item })
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
                      navigate("/matching/request/profile", { state: item })
                    }
                  >
                    {item.name}
                    <img src={name_arrow} alt="" className="mr_m_arrow" />
                  </p>
                  <p className="mr_m_expire">{item.expire}</p>
                </div>
                <RequestButtons className="mr_m_btns" />
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
