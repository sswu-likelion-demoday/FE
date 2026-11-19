import { useNavigate } from "react-router-dom";
import "./Matchinghome.scss";
import BottomNav from "../../../components/BottomNav/BottomNav";
import MatchingButton from "../components/MatchingButton";
import MatchingCard from "../components/MatchingCard";
import logo_matching from "../../../assets/images/Matching/logo_symbol_matching.svg";

const Matchinghome = () => {
  const navigate = useNavigate();

  // 0이면 꽉 찬 화면, 1 이상이면 빈 수정이 있는 화면
  const emptySlotCount = 1;
  const isFull = emptySlotCount === 0;

  const handleMatchingClick = () => {
    console.log("매칭 버튼 클릭");
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
          onClick={handleMatchingClick}
        />
        <MatchingButton
          label="기운을 보완해 줄 수정구함"
          description="사주를 기반으로 나와 잘 맞는 수정을 찾아요"
          disabled={isFull}
          onClick={handleMatchingClick}
        />
      </div>
      <BottomNav initialMenu="matching" />
    </div>
  );
};

export default Matchinghome;
