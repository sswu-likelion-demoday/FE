import { useNavigate } from "react-router-dom";
import "./MatchingInfo.scss";
import MatchingInfoCard from "../../components/MatchingInfoCard";
import SajuMatchingCard from "../../components/SajuMatchingCard";
import MypageHeader from "../../components/MypageHeader";
import star_purple from "../../../../assets/images/Mypage/star_purple.svg";

const MatchingInfo = () => {
  const navigate = useNavigate();

  const infoList = [
    {
      id: "mbti",
      title: "나의 성향",
      description: "MBTI",
      items: ["I", "N", "F", "J"],
      isMbti: true,
      path: "/mypage/mbti-edit",
    },
    {
      id: "meeting",
      title: "사람을 만나는 방식",
      description: "최대 2개",
      items: ["소수와 깊게", "1:1 대화"],
      path: "/mypage/meeting-style-edit",
    },
    {
      id: "category",
      title: "관심 카테고리",
      description: "최소 3개",
      items: ["#운동", "#카페", "#전시", "#음악"],
      path: "/mypage/interest-category",
    },
    {
      id: "hobby",
      title: "즐겨하는 취미",
      description: "최소 3개",
      items: ["#러닝", "#보드게임", "#사진"],
      path: "/mypage/hobby-edit",
    },
    {
      id: "friend",
      title: "만나고 싶은 친구",
      items: ["함께 운동할 친구", "대화가 잘 통하는 친구"],
      path: "/mypage/friend-type-edit",
    },
  ];

  return (
    <div className="page MatchingInfo_wrap">
      <div className="matchinginfo_top">
        <MypageHeader title="매칭 정보" onBack={() => navigate("/mypage")} />
        <div className="mi_t_box">
          <img src={star_purple} alt="" />
          <p>회원가입 시 답한 내용이에요. 수정하면 다음 매칭부터 반영돼요</p>
        </div>
      </div>
      <div className="matchinginfo_main">
        <div className="mi_m_1">
          {infoList.map((info) => (
            <MatchingInfoCard
              key={info.id}
              title={info.title}
              description={info.description}
              items={info.items}
              isMbti={info.isMbti}
              onEdit={() => navigate(info.path)}
            />
          ))}
        </div>
        <div className="mi_m_2">
          <SajuMatchingCard
            birthDate="2004.08.05 (양력)"
            birthTime="12:00"
            onEdit={() => navigate("/mypage/saju-edit")}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchingInfo;
