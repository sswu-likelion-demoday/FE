import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";
import TabMenu from "../../components/TabMenu";
import NoticeItem from "../../components/NoticeItem";
import "./Notice.scss";

const notices = [
  {
    id: 1,
    category: "이벤트",
    title: "IT융합대학인의 날 · 수정 2배 이벤트",
    date: "2026.09.24",
    isPinned: true,
  },
  {
    id: 2,
    category: "서비스 소식",
    title: "퀘스트 리워드 정책 변경 안내",
    date: "2026.09.20",
  },
  {
    id: 3,
    category: "서비스 소식",
    title: "수정 사용 안내",
    date: "2026.09.15",
  },
  {
    id: 4,
    category: "서비스 소식",
    title: "관계 단계 기능이 추가됐어요",
    date: "2026.09.10",
  },
];

const Notice = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("전체");

  const filteredNotices =
    selectedTab === "전체"
      ? notices
      : notices.filter((notice) => notice.category === selectedTab);

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
              key={notice.id}
              category={notice.category}
              title={notice.title}
              date={notice.date}
              isPinned={notice.isPinned}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notice;
