import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Matchinghome.scss";
import { getMatchingHome } from "../../../api/matching";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingButton from "../components/MatchingButton";
import MatchingCard from "../components/MatchingCard";
import logo_matching from "../../../assets/images/Matching/logo_symbol_matching.svg";

const Matchinghome = () => {
  const navigate = useNavigate();

  // 관계 슬롯 { used, available, total } - 매칭 홈 조회 API
  const [slots, setSlots] = useState(null);

  useEffect(() => {
    getMatchingHome()
      .then((data) => setSlots(data.relationshipSlots))
      .catch((err) => console.error(err));
  }, []);

  // 0이면 꽉 찬 화면, 1 이상이면 빈 수정이 있는 화면
  const emptySlotCount = slots?.available ?? 0;
  const isFull = slots !== null && emptySlotCount === 0;

  // 사주 매칭 허용 여부 (확인용 임시 값)
  const isSajuAllowed = false;

  // 사주 매칭 화면으로 이동 (허용 안 한 사람은 설정 창이 같이 뜸)
  const handleSajuClick = () => {
    navigate("/matching/saju", { state: { showSetting: !isSajuAllowed } });
  };

  return (
    <div className="page Matchinghome_wrap">
      <div className="matchinghome_top">
        <img src={logo_matching} alt="" />
      </div>
      <div className="matchinghome_main">
        <div className="mh_m_title">
          <p>오늘 나리님에게는</p>
          <p>어떤 인연이 찾아올까요?</p>
        </div>
        <button
          type="button"
          className="mh_m_crystal"
          onClick={() => !isFull && navigate("/matching/request")}
        >
          <span>비어있는 수정 {emptySlotCount}개</span>
          <span className="mh_m_arrow" />
        </button>
        <p className="mh_m_desc">
          {isFull
            ? "맺어진 수정에 집중해 주세요"
            : "하나의 수정을 더 찾을 수 있어요."}
        </p>
        <MatchingCard
          isFull={isFull}
          onClick={() => !isFull && navigate("/matching/start")}
        />
        <MatchingButton
          label="테마별 수정구함"
          description="카테고리를 선택해 목적에 맞는 수정을 찾아요"
          onClick={() => navigate("/matching/category")}
        />
        <MatchingButton
          label="기운을 보완해 줄 수정구함"
          description="사주를 기반으로 나와 잘 맞는 수정을 찾아요"
          disabled={isFull}
          onClick={handleSajuClick}
        />
      </div>
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default Matchinghome;
