import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMypage } from "../../api/mypage";
import "./Mypage.scss";
import MenuItem from "./components/MenuItem";
import LogoutModal from "./components/LogoutModal";
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mypageData, setMypageData] = useState(null);

  useEffect(() => {
    const fetchMypage = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) return;

      try {
        const data = await getMypage(accessToken);
        setMypageData(data);
      } catch (error) {
        console.error("마이페이지 조회 실패:", error);
      }
    };

    fetchMypage();
  }, []);

  return (
    <div className="page Mypage_wrap">
      <div className="mypage_top">
        <div className="m_t_1">마이</div>
        <div className="m_t_2">
          <img src={mypageData?.profileImageUrl || profile_icon} alt="" />
          <div className="m_t_2_txt">
            <p>{mypageData?.nickname ?? "-"}</p>
            <span>
              {mypageData
                ? `${mypageData.departmentName} · ${mypageData.studentNumber}`
                : "-"}
            </span>
          </div>
          <button onClick={() => navigate("/mypage/edit-profile")}>
            내 정보 수정
          </button>
        </div>
        <div className="m_t_3" onClick={() => navigate("/mypage/item-history")}>
          <img src={sujeonggu} alt="" />
          <div className="m_t_3_txt">
            <span>보유한 수정구</span>
            <p>{mypageData ? `${mypageData.currencyBalance}개` : "-"}</p>
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
              onClick={() => navigate("/mypage/matching-info")}
            />
          </div>
        </div>
        <div className="m_m_2">
          <p>활동</p>
          <div className="m_m_box">
            <MenuItem
              icon={block_icon}
              title="차단 목록"
              detail={mypageData ? `${mypageData.blockedUserCount}명` : "-"}
              onClick={() => navigate("/mypage/block-list")}
            />
          </div>
        </div>
        <div className="m_m_3">
          <p>고객지원</p>
          <div className="m_m_box">
            <MenuItem
              icon={notice_icon}
              title="공지사항"
              onClick={() => navigate("/mypage/notice")}
            />
            <MenuItem
              icon={contact_icon}
              title="고객센터"
              onClick={() => navigate("/mypage/customer-center")}
            />
          </div>
        </div>
        <div className="m_m_4">
          <button onClick={() => setShowLogoutModal(true)}>로그아웃</button>
          <p>|</p>
          <button type="button" onClick={() => navigate("/mypage/withdraw")}>
            회원 탈퇴
          </button>
        </div>
      </div>

      <div className="mypage_bot">
        <BottomNav />
      </div>

      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
            sessionStorage.removeItem("nickname");
            setShowLogoutModal(false);
            navigate("/login", { replace: true });
          }}
        />
      )}
    </div>
  );
};

export default Mypage;
