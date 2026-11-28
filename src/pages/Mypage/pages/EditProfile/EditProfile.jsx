import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../../../../api/mypage";

import MypageHeader from "../../components/MypageHeader";
import "./EditProfile.scss";
import profile_icon from "../../../../assets/images/Mypage/profile_icon.svg";
import camera_icon from "../../../../assets/images/Mypage/camera.svg";
import lock_icon from "../../../../assets/images/Mypage/lock.svg";

const EditProfile = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) return;

      try {
        const data = await getMyProfile(accessToken);

        setNickname(data.nickname);
        setDepartmentName(data.department?.name ?? "");
        setStudentNumber(data.studentNumber);
        setProfileImageUrl(data.profileImageUrl);

        setOriginalProfile({
          nickname: data.nickname,
          departmentName: data.department?.name ?? "",
        });
      } catch (error) {
        console.error("내 정보 조회 실패:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    setProfileImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (isSaving) return;

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!originalProfile) {
      alert("내 정보를 불러오지 못했습니다.");
      return;
    }

    if (!nickname.trim() || !departmentName.trim()) {
      alert("닉네임과 학과를 입력해 주세요.");
      return;
    }

    const updateData = {};

    if (nickname.trim() !== originalProfile.nickname) {
      updateData.nickname = nickname.trim();
    }

    if (departmentName.trim() !== originalProfile.departmentName) {
      updateData.departmentName = departmentName.trim();
    }

    if (Object.keys(updateData).length === 0 && !profileImage) {
      navigate("/mypage");
      return;
    }

    try {
      setIsSaving(true);

      await updateMyProfile(accessToken, updateData, profileImage);

      alert("내 정보가 수정되었습니다.");
      navigate("/mypage");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page EditProfile_wrap">
      <div className="editprofile_top">
        <MypageHeader title="내 정보" onBack={() => navigate("/mypage")} />
      </div>
      <div className="editprofile_main">
        <div className="e_m_1">
          <img src={previewUrl || profileImageUrl || profile_icon} alt="" />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <div
            className="e_m_1_camera"
            onClick={() => fileInputRef.current?.click()}
          >
            <img src={camera_icon} alt="" />
          </div>
        </div>
        <div className="e_m_2">
          <p>닉네임</p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="e_m_3">
          <p>학과</p>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
        </div>
        <div className="e_m_4">
          <p>학번</p>
          <div className="e_m_4_box">
            <p>{studentNumber}</p>
            <img src={lock_icon} alt="" />
          </div>
          <span>학번은 변경할 수 없어요</span>
        </div>
      </div>
      <div className="editprofile_bot">
        <button
          className="editprofile_bot_btn"
          onClick={handleSave}
          disabled={isSaving}
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
