import { useNavigate } from "react-router-dom";

import MypageHeader from "../../components/MypageHeader";
import "./EditProfile.scss";
import profile_icon from "../../../../assets/images/Mypage/profile_icon.svg";
import camera_icon from "../../../../assets/images/Mypage/camera.svg";
import lock_icon from "../../../../assets/images/Mypage/lock.svg";

const EditProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="page EditProfile_wrap">
      <div className="editprofile_top">
        <MypageHeader title="내 정보" onBack={() => navigate("/mypage")} />
      </div>
      <div className="editprofile_main">
        <div className="e_m_1">
          <img src={profile_icon} alt="" />
          <div className="e_m_1_camera">
            <img src={camera_icon} alt="" />
          </div>
        </div>
        <div className="e_m_2">
          <p>닉네임</p>
          <input type="text" />
        </div>
        <div className="e_m_3">
          <p>학과</p>
          <input type="text" />
        </div>
        <div className="e_m_4">
          <p>학번</p>
          <div className="e_m_4_box">
            <p>20240000</p>
            <img src={lock_icon} alt="" />
          </div>
          <span>학번은 변경할 수 없어요</span>
        </div>
      </div>
      <div className="editprofile_bot">
        <button
          className="editprofile_bot_btn"
          onClick={() => navigate("/signup/profile")}
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
