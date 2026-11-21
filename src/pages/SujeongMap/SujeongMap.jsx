import "./SujeongMap.scss";
import BottomNav from "../../components/BottomNav/BottomNav";
import MatchingHeader from "../Matching/components/MatchingHeader";
import matching_ring from "../../assets/images/Matching/matching_ring.svg";
import crystal_orb from "../../assets/images/Matching/crystal_orb.svg";
import zoom_icon from "../../assets/images/SujeongMap/zoom_icon.svg";

const SujeongMap = () => {
  return (
    <div className="page SujeongMap_wrap">
      <MatchingHeader title="수정맵" showBack={false} />
      <div className="sujeongmap_main">
        <span className="sm_m_bg" />
        <span className="sm_m_circle circle01" />
        <span className="sm_m_circle circle02" />
        <span className="sm_m_circle circle03" />

        <p className="sm_m_title">수정을 눌러 연결된 관계를 확인해 보세요</p>
        <p className="sm_m_desc">
          나와의 거리가 가까울수록
          <br />더 깊은 관계를 맺은 수정이에요
        </p>

        <div className="sm_m_me">
          <img src={matching_ring} alt="" />
        </div>
        <p className="sm_m_name">나리</p>

        <img src={crystal_orb} alt="" className="sm_m_orb orb01" />
        <img src={crystal_orb} alt="" className="sm_m_orb orb02" />
        <img src={crystal_orb} alt="" className="sm_m_orb orb03" />
        <img src={crystal_orb} alt="" className="sm_m_orb orb04" />

        <div className="sm_m_hint">
          <img src={zoom_icon} alt="" />
          <p>
            화면을 확대하거나 움직여
            <br />
            나만의 수정맵을 둘러볼 수 있어요
          </p>
        </div>
      </div>
      <BottomNav initialMenu="map" />
    </div>
  );
};

export default SujeongMap;
