import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SujeongMap.scss";
import BottomNav from "../../components/BottomNav/BottomNav";
import MatchingHeader from "../Matching/components/MatchingHeader";
import logo_symbol_2 from "../../assets/images/Onboarding/logo_symbol_2.svg";
import matching_profile from "../../assets/images/Matching/matching_profile.svg";
import matching_mascot from "../../assets/images/Matching/matching_mascot.svg";
import header_back from "../../assets/images/Matching/header.back.svg";
import map_expand from "../../assets/images/SujeongMap/map_expand.svg";
import map_location from "../../assets/images/SujeongMap/map_location.svg";
import select_map from "../../assets/images/SujeongMap/select_map.svg";

const MIN_SCALE = 0.7;
const MAX_SCALE = 2;

// 지도 가운데 (나리 구슬 가운데, 지도 영역 기준)
// Figma 나리 구슬 X 158, Y 395 → 158 + 38, 395 - 107(헤더) + 38
const CENTER_X = 196;
const CENTER_Y = 326;

// 내 주변 수정들 (확인용 임시 데이터)
// x, y는 지도 안에서 구슬 가운데 위치
const orbData = [
  {
    id: 1,
    className: "orb01",
    name: "달빛여우",
    stage: 2,
    stageName: "알아가는 중",
    x: 269,
    y: 228,
  },
  {
    id: 2,
    className: "orb02",
    name: "새벽산책",
    stage: 1,
    stageName: "첫 만남",
    x: 79,
    y: 195,
  },
  {
    id: 3,
    className: "orb03",
    name: "고양이 집사",
    stage: 3,
    stageName: "가까워지는 중",
    x: 329,
    y: 122,
  },
  {
    id: 4,
    className: "orb04",
    name: "밤양갱",
    stage: 1,
    stageName: "첫 만남",
    x: 393,
    y: 461,
  },
];

const SujeongMap = () => {
  const navigate = useNavigate();

  // 지도 확대 비율과 이동 위치
  const [scale, setScale] = useState(1);
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);

  // 선택한 수정, 선택한 수정으로 이동하는 중인지
  const [selected, setSelected] = useState(null);
  const [isFocusing, setIsFocusing] = useState(false);

  // 화면에 닿아 있는 손가락(마우스) 위치들
  const pointers = useRef({});
  const lastDistance = useRef(0);

  // 처음 화면에서 한 번이라도 움직였는지
  const isMoved = scale !== 1 || moveX !== 0 || moveY !== 0;

  const changeScale = (nextScale) => {
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale)));
  };

  const getDistance = () => {
    const [a, b] = Object.values(pointers.current);
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  // 선택한 수정을 화면 가운데(나리 자리)로 옮김
  const handleSelect = (orb) => {
    setSelected(orb);
    setIsFocusing(true);
    setMoveX(-(orb.x - CENTER_X) * scale);
    setMoveY(-(orb.y - CENTER_Y) * scale);
  };

  const handlePointerDown = (e) => {
    setIsFocusing(false);
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current[e.pointerId] = { x: e.clientX, y: e.clientY };

    if (Object.keys(pointers.current).length === 2) {
      lastDistance.current = getDistance();
    }
  };

  const handlePointerMove = (e) => {
    const before = pointers.current[e.pointerId];
    if (!before) return;

    pointers.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    const count = Object.keys(pointers.current).length;

    // 한 손가락: 지도 이동
    if (count === 1) {
      setMoveX((x) => x + (e.clientX - before.x));
      setMoveY((y) => y + (e.clientY - before.y));
    }

    // 두 손가락: 확대 / 축소
    if (count === 2) {
      const distance = getDistance();
      changeScale(scale * (distance / lastDistance.current));
      lastDistance.current = distance;
    }
  };

  const handlePointerUp = (e) => {
    delete pointers.current[e.pointerId];
  };

  // 컴퓨터에서는 마우스 휠로 확대 / 축소
  const handleWheel = (e) => {
    changeScale(e.deltaY < 0 ? scale * 1.1 : scale * 0.9);
  };

  const handleMyLocation = () => {
    setIsFocusing(true);
    setScale(1);
    setMoveX(0);
    setMoveY(0);
  };

  return (
    <div className="page SujeongMap_wrap">
      <MatchingHeader title="수정맵" showBack={false} />
      <div
        className="sujeongmap_main"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          className={isFocusing ? "sm_m_map focusing" : "sm_m_map"}
          style={{
            transform: `translate(${moveX}px, ${moveY}px) scale(${scale})`,
          }}
        >
          <span className="sm_m_bg" />
          <span className="sm_m_circle circle01" />
          <span className="sm_m_circle circle02" />
          <span className="sm_m_circle circle03" />
          <div className="sm_m_me">
            <img src={logo_symbol_2} alt="" />
          </div>
          <p className="sm_m_name">나리</p>
          {orbData.map((orb) => {
            const isSelected = selected && selected.id === orb.id;
            return (
              <div
                key={orb.id}
                className={`sm_m_orb ${orb.className}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleSelect(orb)}
              >
                <img src={isSelected ? select_map : matching_profile} alt="" />
                {isSelected && <span className="sm_m_label">{orb.name}</span>}
              </div>
            );
          })}
        </div>
        {selected && (
          <div className="sm_m_card">
            <div className="sm_m_card_top">
              <img src={matching_mascot} alt="" className="sm_m_card_profile" />
              <p className="sm_m_card_name">{selected.name}</p>
              {/* 화살표 누르면 이 수정과의 채팅방으로 이동 (임시: 수정 id를 채팅방 id로 사용) */}
              <img
                src={header_back}
                alt=""
                className="sm_m_card_arrow"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => navigate(`/chat/${selected.id}`)}
              />
            </div>
            <div className="sm_m_card_stage">
              <span>{selected.stage}단계</span>
              <p>{selected.stageName}</p>
            </div>
            <div className="sm_m_card_bars">
              {[1, 2, 3, 4].map((step) => {
                let barClass = "";
                if (step < selected.stage) barClass = "done";
                if (step === selected.stage) barClass = "now";
                return <span key={step} className={barClass} />;
              })}
            </div>
          </div>
        )}
        {!isMoved && !selected && (
          <p className="sm_m_title">수정을 눌러 연결된 관계를 확인해 보세요</p>
        )}
        {!isMoved && !selected && (
          <p className="sm_m_desc">
            나와의 거리가 가까울수록
            <br />더 깊은 관계를 맺은 수정이에요
          </p>
        )}
        {!isMoved && (
          <div className="sm_m_hint">
            <img src={map_expand} alt="" />
            <p>
              화면을 확대하거나 움직여
              <br />
              나만의 수정맵을 둘러볼 수 있어요
            </p>
          </div>
        )}
        {isMoved && (
          <button
            type="button"
            className="sm_m_location"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleMyLocation}
          >
            <img src={map_location} alt="" />
            내 위치로
          </button>
        )}
      </div>
      <BottomNav initialMenu="map" />
    </div>
  );
};

export default SujeongMap;
