import { useLocation, useNavigate } from "react-router-dom";
import "./BottomNav.scss";

import matching_icon from "../../assets/images/BottomNav/matching_icon.svg";
import matching2_icon from "../../assets/images/BottomNav/matching2_icon.svg";
import chat_icon from "../../assets/images/BottomNav/chat_icon.svg";
import chat2_icon from "../../assets/images/BottomNav/chat2_icon.svg";
import map_icon from "../../assets/images/BottomNav/map_icon.svg";
import map2_icon from "../../assets/images/BottomNav/map2_icon.svg";
import mypage_icon from "../../assets/images/BottomNav/mypage_icon.svg";
import mypage2_icon from "../../assets/images/BottomNav/mypage2_icon.svg";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 추후 경로에 맞게 수정하기
  const isMatching = location.pathname.startsWith("/matching");
  const isChat = location.pathname.startsWith("/chat");
  const isMap = location.pathname.startsWith("/map");
  const isMypage = location.pathname.startsWith("/mypage");

  return (
    <div className="BottomNav_wrap">
      <div
        className={`bottomnav_box1 ${isMatching ? "active" : ""}`}
        onClick={() => navigate("/matching")}
      >
        <img
          src={isMatching ? matching2_icon : matching_icon}
          alt=""
          className="matching_icon"
        />
        <p>매칭</p>
      </div>

      <div
        className={`bottomnav_box2 ${isChat ? "active" : ""}`}
        onClick={() => navigate("/chat")}
      >
        <img
          src={isChat ? chat2_icon : chat_icon}
          alt=""
          className="chat_icon"
        />
        <p>채팅</p>
      </div>

      <div
        className={`bottomnav_box3 ${isMap ? "active" : ""}`}
        onClick={() => navigate("/map")}
      >
        <img src={isMap ? map2_icon : map_icon} alt="" className="map_icon" />
        <p>수정맵</p>
      </div>

      <div
        className={`bottomnav_box4 ${isMypage ? "active" : ""}`}
        onClick={() => navigate("/mypage")}
      >
        <img
          src={isMypage ? mypage2_icon : mypage_icon}
          alt=""
          className="mypage_icon"
        />
        <p>마이</p>
      </div>
    </div>
  );
};

export default BottomNav;
