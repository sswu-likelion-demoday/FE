
import matching_profile from "../../../assets/images/Matching/matching_profile.svg";
import "./ProfileCard.scss";

const ProfileCard = ({
  title,
  nickname,
  studentId,
  description,
  profileImageUrl,
  compatibilityScore,
}) => {
  return (
    <div className="profile_card">
      <h2 className="profile_card_title">{title}</h2>

      <img
        className={`profile_card_image${profileImageUrl ? " uploaded" : ""}`}
        src={profileImageUrl || matching_profile}
        alt="프로필 이미지"
      />

      <div className="profile_card_info">
        <p className="profile_card_name">{nickname}</p>
        {studentId !== null && studentId !== undefined && studentId !== "" && (
          <p className="profile_card_student">{studentId}학번</p>
        )}
        {typeof compatibilityScore === "number" && (
          <p className="profile_card_score">사주 궁합 {compatibilityScore}점</p>
        )}
        {description && <p className="profile_card_description">{description}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;
