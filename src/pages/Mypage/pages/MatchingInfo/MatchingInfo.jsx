import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMatchingProfile, getSajuSettings } from "../../../../api/mypage";
import "./MatchingInfo.scss";
import MatchingInfoCard from "../../components/MatchingInfoCard";
import SajuMatchingCard from "../../components/SajuMatchingCard";
import MypageHeader from "../../components/MypageHeader";
import star_purple from "../../../../assets/images/Mypage/star_purple.svg";

const MatchingInfo = () => {
  const navigate = useNavigate();
  const [matchingData, setMatchingData] = useState(null);
  const [sajuData, setSajuData] = useState(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) return;

    const fetchMatchingProfile = async () => {
      try {
        const data = await getMatchingProfile(accessToken);
        setMatchingData(data);
      } catch (error) {
        console.error("매칭 정보 조회 실패:", error);
      }
    };

    const fetchSajuSettings = async () => {
      try {
        const data = await getSajuSettings(accessToken);
        setSajuData(data);
      } catch (error) {
        console.error("사주 설정 조회 실패:", error);
      }
    };

    fetchMatchingProfile();
    fetchSajuSettings();
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
      items: matchingData?.socialStyles?.map((item) => item.name) ?? [],
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
              onEdit={() => {
                if (info.id === "mbti") {
                  navigate(info.path, {
                    state: { mbti: matchingData?.mbti },
                  });
                } else if (info.id === "meeting") {
                  navigate(info.path, {
                    state: {
                      socialStyleCodes: matchingData?.socialStyles?.map(
                        (item) => item.code,
                      ),
                    },
                  });
                } else if (info.id === "category") {
                  navigate(info.path, {
                    state: {
                      interestCodes: matchingData?.interests?.map(
                        (item) => item.code,
                      ),
                    },
                  });
                } else if (info.id === "hobby") {
                  navigate(info.path, {
                    state: {
                      hobbyCodes: matchingData?.hobbies?.map(
                        (item) => item.code,
                      ),
                    },
                  });
                } else if (info.id === "friend") {
                  navigate(info.path, {
                    state: {
                      friendTypeCodes: matchingData?.friendTypes?.map(
                        (item) => item.code,
                      ),
                    },
                  });
                }
              }}
            />
          ))}
        </div>
        <div className="mi_m_2">
          <SajuMatchingCard
            birthDate={
              !sajuData
                ? "-"
                : sajuData.matchingEnabled
                  ? `${sajuData.birthDate?.replaceAll("-", ".") ?? ""} (${
                      sajuData.calendarType === "SOLAR"
                        ? "양력"
                        : sajuData.calendarType === "LUNAR"
                          ? "음력"
                          : "-"
                    })`
                  : "사주 매칭 미사용"
            }
            birthTime={
              sajuData?.matchingEnabled ? (sajuData.birthTime ?? "-") : "-"
            }
            onEdit={() => {
              if (!sajuData) {
                alert("사주 설정을 불러오지 못했습니다.");
                return;
              }

              navigate("/mypage/saju-edit", {
                state: { saju: sajuData },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchingInfo;
