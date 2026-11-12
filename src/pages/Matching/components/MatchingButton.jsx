import "./MatchingButton.scss";

// 아이콘은 currentColor로 그려서 버튼 글자색을 그대로 따라감
// 시안 수치(선 기준): 체크 12.14 × 11.5, X 11.5 × 11.5, 선 굵기 2
// 선 굵기의 절반(1px)이 바깥으로 나가므로 viewBox를 사방 1씩 넓혀둠
const ICONS = {
  check: (
    <svg width="14.14" height="13.5" viewBox="-1 -1 14.14 13.5" fill="none">
      <path
        d="M0 6.2L4.3 11.5L12.14 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  close: (
    <svg width="13.5" height="13.5" viewBox="-1 -1 13.5 13.5" fill="none">
      <path
        d="M0 0L11.5 11.5M11.5 0L0 11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const MatchingButton = ({
  label,
  description,
  variant = "primary", // primary | secondary | danger
  size = "large", // large | medium
  icon, // check | close (왼쪽 아이콘)
  showArrow = variant === "primary",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`matching_btn ${variant} ${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && ICONS[icon] && (
        <span className="matching_btn_icon" aria-hidden="true">
          {ICONS[icon]}
        </span>
      )}
      <span className="matching_btn_text">
        <span className="matching_btn_title">{label}</span>
        {description && (
          <span className="matching_btn_description">{description}</span>
        )}
      </span>
      {showArrow && <span className="matching_btn_arrow" aria-hidden="true" />}
    </button>
  );
};

export default MatchingButton;
