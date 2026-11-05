import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TabMenu from "../../components/TabMenu";
import MypageHeader from "../../components/MypageHeader";
import PointHistoryItem from "../../components/PointHistoryItem";
import "./ItemHistory.scss";
import sujeonggu from "../../../../assets/images/Mypage/sujeonggu.svg";

const ItemHistory = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("획득 내역");

  return (
    <div className="page ItemHistory_wrap">
      <div className="itemhistory_top">
        <MypageHeader title="수정구 내역" onBack={() => navigate("/mypage")} />
      </div>
      <div className="itemhistory_main">
        <div className="i_m_1">
          <img src={sujeonggu} alt="" />
          <span>보유한 수정구</span>
          <p>120개</p>
        </div>
        <div className="i_m_2">
          <TabMenu
            tabs={["획득 내역", "사용 내역"]}
            selected={selectedTab}
            onChange={setSelectedTab}
          />
        </div>
        {selectedTab === "획득 내역" ? (
          <>
            <div className="i_m_earning">
              <div className="i_m_e_1">
                <span>9월 24일</span>
                <div className="i_m_e_box">
                  <PointHistoryItem
                    category="관계 단계 달성"
                    title="달빛여우님과 2단계"
                    amount={10}
                  />

                  <PointHistoryItem
                    category="AI 퀴즈 정답"
                    title="달빛여우님 퀴즈 맞히기"
                    amount={5}
                  />
                </div>
              </div>
              <div className="i_m_e_2">
                <span>9월 22일</span>
                <div className="i_m_e_box">
                  <PointHistoryItem
                    category="관계 단계 달성"
                    title="고양이집사님과 3단계"
                    amount={10}
                  />

                  <PointHistoryItem
                    category="AI 퀴즈 정답"
                    title="고양이집사님 퀴즈 맞히기"
                    amount={5}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="i_m_usage">{/* 사용 내역 UI는 추후 구현 */}</div>
        )}
      </div>
    </div>
  );
};

export default ItemHistory;
