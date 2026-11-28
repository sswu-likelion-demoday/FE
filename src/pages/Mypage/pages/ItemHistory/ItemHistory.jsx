import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { getWalletTransactions } from "../../../../api/mypage";
import TabMenu from "../../components/TabMenu";
import MypageHeader from "../../components/MypageHeader";
import PointHistoryItem from "../../components/PointHistoryItem";
import "./ItemHistory.scss";
import sujeonggu from "../../../../assets/images/Mypage/sujeonggu.svg";

const ItemHistory = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("획득 내역");

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);

  const fetchTransactions = useCallback(async (tab, cursor = null) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) return;

    const requestId = ++requestIdRef.current;

    if (cursor === null) {
      setTransactions([]);
      setNextCursor(null);
      setHasNext(false);
    }

    try {
      setIsLoading(true);

      const data = await getWalletTransactions(accessToken, {
        type: tab === "획득 내역" ? "EARN" : "USE",
        cursor,
        size: 20,
      });

      if (requestId !== requestIdRef.current) return;

      setBalance(data.balance);
      setTransactions((prev) =>
        cursor === null ? data.transactions : [...prev, ...data.transactions],
      );
      setNextCursor(data.nextCursor);
      setHasNext(data.hasNext);
    } catch (error) {
      if (requestId === requestIdRef.current) {
        console.error("수정구 내역 조회 실패:", error);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchTransactions("획득 내역");

    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchTransactions]);

  const handleTabChange = (tab) => {
    if (tab === selectedTab) return;

    setSelectedTab(tab);
    fetchTransactions(tab);
  };

  const groupedTransactions = transactions.reduce((acc, item) => {
    const date = item.createdAt?.slice(0, 10) ?? "";

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(item);
    return acc;
  }, {});

  const reasonLabels = {
    RELATIONSHIP_STAGE_COMPLETED: "관계 단계 달성",
    QUEST_COMPLETED: "퀘스트 완료",
  };

  return (
    <div className="page ItemHistory_wrap">
      <div className="itemhistory_top">
        <MypageHeader title="수정구 내역" onBack={() => navigate("/mypage")} />
      </div>
      <div className="itemhistory_main">
        <div className="i_m_1">
          <img src={sujeonggu} alt="" />
          <span>보유한 수정구</span>
          <p>{balance}개</p>
        </div>
        <div className="i_m_2">
          <TabMenu
            tabs={["획득 내역", "사용 내역"]}
            selected={selectedTab}
            onChange={handleTabChange}
          />
        </div>

        {selectedTab === "획득 내역" ? (
          <div className="i_m_earning">
            {Object.entries(groupedTransactions).map(([date, items]) => {
              const [, month, day] = date.split("-");

              return (
                <div className="i_m_e_1" key={date}>
                  <span>
                    {Number(month)}월 {Number(day)}일
                  </span>

                  <div className="i_m_e_box">
                    {items.map((item) => (
                      <PointHistoryItem
                        key={item.transactionId}
                        category={reasonLabels[item.reason] ?? item.reason}
                        title={item.description}
                        amount={item.amount}
                        type={item.type}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {hasNext && nextCursor != null && (
              <button
                type="button"
                onClick={() => fetchTransactions(selectedTab, nextCursor)}
                disabled={isLoading}
              >
                {isLoading ? "불러오는 중..." : "더 보기"}
              </button>
            )}
          </div>
        ) : (
          <div className="i_m_usage">
            <p>사용 내역은 추후 연결 예정입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemHistory;
