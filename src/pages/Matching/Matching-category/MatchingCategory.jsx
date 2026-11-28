import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchingCategory.scss";
import { getCategoryMatchStatus } from "../../../api/matching";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingHeader from "../components/MatchingHeader";
import CategorySelectPage from "../components/CategorySelectPage";

const MatchingCategory = () => {
  const navigate = useNavigate();

  // 카테고리별 상태 { MEAL: { state, requestId, hasNewResult }, ... } - 카테고리 매칭 상태 조회 API
  const [statusMap, setStatusMap] = useState(null);

  useEffect(() => {
    let active = true;
    getCategoryMatchStatus()
      .then((data) => {
        if (!active) return;
        const map = {};
        data.categories.forEach((item) => {
          map[item.category] = item;
        });
        setStatusMap(map);
      })
      .catch((err) => active && alert(err.message));
    return () => {
      active = false;
    };
  }, []);

  // 새 결과가 있는 카테고리에 ① 표시
  const badgeCounts = {};
  Object.values(statusMap ?? {}).forEach((item) => {
    if (item.hasNewResult) badgeCounts[item.category] = 1;
  });

  // NONE: 신청 화면 / WAITING: 매칭 대기 화면 / RESULT_PENDING: 매칭 완료 화면
  const handleSelect = (category) => {
    const status = statusMap?.[category];
    if (!status) return;

    const state = { category, requestId: status.requestId };
    if (status.state === "WAITING") {
      navigate("/matching/category/waiting", { state });
    } else if (status.state === "RESULT_PENDING") {
      navigate("/matching/category/found", { state });
    } else {
      navigate("/matching/category/form", { state });
    }
  };

  // 카테고리 생성 요청은 기능 없음
  const handleRequestCategory = () => {};

  return (
    <div className="page MatchingCategory_wrap">
      <MatchingHeader title="카테고리 선택" onBack={() => navigate("/matching")} />
      <CategorySelectPage
        badgeCounts={badgeCounts}
        onSelect={handleSelect}
        onRequestCategory={handleRequestCategory}
      />
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default MatchingCategory;
