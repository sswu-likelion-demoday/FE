import { useState, useEffect } from "react";
import { getNotices } from "../../../../api/mypage";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";
import TabMenu from "../../components/TabMenu";
import NoticeItem from "../../components/NoticeItem";
import "./Notice.scss";

const Notice = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("전체");
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) return;

      try {
        const data = await getNotices(accessToken);
        setNotices(data.notices ?? []);
      } catch (error) {
        console.error("공지사항 조회 실패:", error);
      }
    };

    fetchNotices();
  }, []);

  const categoryLabels = {
    EVENT: "이벤트",
  };

  const filteredNotices =
    selectedTab === "전체"
      ? notices
      : notices.filter(
          (notice) =>
            (categoryLabels[notice.category] ?? notice.category) ===
            selectedTab,
        );

  return (
    <div className="page Notice_wrap">
      <div className="notice_top">
        <MypageHeader title="공지사항" onBack={() => navigate("/mypage")} />
      </div>

      <div className="notice_main">
        <div className="notice_tabs">
          <TabMenu
            tabs={["전체", "서비스 소식", "이벤트"]}
            selected={selectedTab}
            onChange={setSelectedTab}
          />
        </div>

        <div className="notice_list">
          {filteredNotices.map((notice) => (
            <NoticeItem
              key={notice.noticeId}
              category={categoryLabels[notice.category] ?? notice.category}
              title={notice.title}
              date={notice.createdAt?.replaceAll("-", ".")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notice;
