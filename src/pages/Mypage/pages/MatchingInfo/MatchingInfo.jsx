import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMatchingProfile } from "../../../../api/mypage";
import "./MatchingInfo.scss";
import MatchingInfoCard from "../../components/MatchingInfoCard";
import SajuMatchingCard from "../../components/SajuMatchingCard";
import MypageHeader from "../../components/MypageHeader";
import star_purple from "../../../../assets/images/Mypage/star_purple.svg";

const MatchingInfo = () => {
  const navigate = useNavigate();
  const [matchingData, setMatchingData] = useState(null);

  useEffect(() => {
    const fetchMatchingProfile = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) return;

      try {
        const data = await getMatchingProfile(accessToken);
        setMatchingData(data);
      } catch (error) {
        console.error("매칭 정보 조회 실패:", error);
      }
    };

    fetchMatchingProfile();
  }, []);

  const infoList = [
    {
      id: "mbti",
      title: "나의 성향",
      description: "MBTI",
      items: matchingData?.mbti?.split("") ?? [],
      isMbti: true,
      path: "/mypage/mbti-edit",
    },
    {
      id: "meeting",
      title: "사람을 만나는 방식",
      description: "최대 2개",
      items: matchingData?.socialStyle
        ? Object.values(matchingData.socialStyle)
        : [],
      path: "/mypage/meeting-style-edit",
    },
    {
      id: "category",
      title: "관심 카테고리",
      description: "최소 3개",
      items: matchingData?.interests?.map((item) => `#${item.name}`) ?? [],
      path: "/mypage/interest-category",
    },
    {
      id: "hobby",
      title: "즐겨하는 취미",
      description: "최소 3개",
      items: matchingData?.hobbies?.map((item) => `#${item.name}`) ?? [],
      path: "/mypage/hobby-edit",
    },
    {
      id: "friend",
      title: "만나고 싶은 친구",
      items: matchingData?.friendTypes?.map((item) => item.name) ?? [],
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
            birthDate={
              matchingData?.saju?.enabled
                ? `${matchingData.saju.birthDate?.replaceAll("-", ".") ?? ""} (${
                    matchingData.saju.calendarType === "SOLAR"
                      ? "양력"
                      : matchingData.saju.calendarType === "LUNAR"
                        ? "음력"
                        : "-"
                  })`
                : "사주 매칭 미사용"
            }
            birthTime={
              matchingData?.saju?.enabled
                ? (matchingData.saju.birthTime ?? "-")
                : "-"
            }
            onEdit={() => navigate("/mypage/saju-edit")}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchingInfo;
