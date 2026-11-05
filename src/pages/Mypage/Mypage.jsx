import { useNavigate } from "react-router-dom";
import "./Mypage.scss";
import MenuItem from "./components/MenuItem";
import BottomNav from "../../components/BottomNav/BottomNav";
import profile_icon from "../../assets/images/Mypage/profile_icon.svg";
import sujeonggu from "../../assets/images/Mypage/sujeonggu.svg";
import next_btn from "../../assets/images/Mypage/next_btn.svg";
import notice_icon from "../../assets/images/Mypage/notice_icon.svg";
import block_icon from "../../assets/images/Mypage/block_icon.svg";
import matchingInfo_icon from "../../assets/images/Mypage/matchinginfo_icon.svg";
import contact_icon from "../../assets/images/Mypage/contact_icon.svg";

const Mypage = () => {
  const navigate = useNavigate();

  return (
    <div className="page Mypage_wrap">
      <div className="mypage_top">
        <div className="m_t_1">마이</div>
        <div className="m_t_2">
          <img src={profile_icon} alt="" />
          <div className="m_t_2_txt">
            <p>나리</p>
            <span>컴퓨터공학과 · 24학번</span>
          </div>
          <button onClick={() => navigate("/mypage/edit-profile")}>
            내 정보 수정
          </button>
        </div>
        <div className="m_t_3">
          <img src={sujeonggu} alt="" />
          <div className="m_t_3_txt">
            <span>보유한 수정구</span>
            <p>120개</p>
          </div>
          <div className="m_t_3_btn">
            <p>내역 보기</p>
            <img src={next_btn} alt="" />
          </div>
        </div>
      </div>

      <div className="mypage_main">
        <div className="m_m_1">
          <p>내 정보</p>
          <div className="m_m_box">
            <MenuItem
              icon={matchingInfo_icon}
              title="매칭 정보"
              detail="온보딩 답변"
              onClick={() => navigate("")}
            />
          </div>
        </div>
        <div className="m_m_2">
          <p>활동</p>
          <div className="m_m_box">
            <MenuItem
              icon={block_icon}
              title="차단 목록"
              detail="2명"
              onClick={() => navigate("")}
            />
          </div>
        </div>
        <div className="m_m_3">
          <p>고객지원</p>
          <div className="m_m_box">
            <MenuItem
              icon={notice_icon}
              title="공지사항"
              onClick={() => navigate("")}
            />
            <MenuItem
              icon={contact_icon}
              title="고객센터"
              onClick={() => navigate("")}
            />
          </div>
        </div>
        <div className="m_m_4">
          <button>로그아웃</button>
          <p>|</p>
          <button>회원 탈퇴</button>
        </div>
      </div>

      <div className="mypage_bot">
        <BottomNav />
      </div>
    </div>
  );
};

export default Mypage;
