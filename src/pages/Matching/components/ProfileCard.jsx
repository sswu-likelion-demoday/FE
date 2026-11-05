
import matching_profile from "../../../assets/images/Matching/matching_profile.svg";
import "./ProfileCard.scss";

const ProfileCard = ({
  title,
  nickname,
  studentId,
  description,
}) => {
  return (
    <div className="profile_card">
      <h2 className="profile_card_title">{title}</h2>

      <img
        className="profile_card_image"
        src={matching_profile}
        alt="프로필 이미지"
      />

      <div className="profile_card_info">
        <p className="profile_card_name">{nickname}</p>
        <p className="profile_card_student">
          {studentId}학번
        </p>
        <p className="profile_card_description">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
