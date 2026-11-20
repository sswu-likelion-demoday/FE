import "./MatchingCard.scss";

import matching_ring from "../../../assets/images/Matching/matching_ring.svg";
import matching_star from "../../../assets/images/Matching/matching_star.svg";

const MatchingCard = ({
  title = "나와 잘맞는 수정 구함",
  isFull = false, // 비어있는 수정이 0개면 true → 배경 그라데이션이 바뀜
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`matching_card ${isFull ? "full" : "available"}`}
      disabled={disabled}
      onClick={onClick}
    >
      {/* 배경 반짝이 3개 (같은 svg를 크기만 다르게) */}
      <img className="matching_card_star star_s" src={matching_star} alt="" aria-hidden="true" />
      <img className="matching_card_star star_m" src={matching_star} alt="" aria-hidden="true" />
      <img className="matching_card_star star_l" src={matching_star} alt="" aria-hidden="true" />

      {/* 수정구슬 + 물음표 */}
      <span className="matching_card_crystal" aria-hidden="true">
        <img src={matching_ring} alt="" />
      </span>

      {/* 제목 + 화살표 묶음 (시안 X 88, Y 170) */}
      <span className="matching_card_label">
        <span className="matching_card_title">{title}</span>
        <svg
          className="matching_card_arrow"
          width="10"
          height="20"
          viewBox="0 0 10 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L9 10L1 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
};

export default MatchingCard;
