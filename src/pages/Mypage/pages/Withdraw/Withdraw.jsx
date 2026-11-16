import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";
import "./Withdraw.scss";
import check_icon from "../../../../assets/images/Mypage/check_icon_2.svg";

const reasons = [
  "원하는 인연을 찾았어요",
  "매칭이 잘 안 돼요",
  "앱을 잘 안 쓰게 돼요",
  "기타",
];

const Withdraw = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] =
    useState("원하는 인연을 찾았어요");
  const [isAgreed, setIsAgreed] = useState(false);

  return (
    <div className="page Withdraw_wrap">
      <div className="withdraw_top">
        <MypageHeader title="회원 탈퇴" onBack={() => navigate("/mypage")} />
      </div>

      <div className="withdraw_main">
        <div className="withdraw_info">
          <h2>나리님, 정말 떠나시나요?</h2>
          <p>탈퇴하면 아래 정보가 모두 삭제되고 복구할 수 없어요.</p>
        </div>

        <div className="withdraw_reason">
          <p>떠나는 이유를 알려주세요 (선택)</p>
          <div className="withdraw_reason_list">
            {reasons.map((reason) => (
              <button
                key={reason}
                type="button"
                className={selectedReason === reason ? "selected" : ""}
                aria-pressed={selectedReason === reason}
                onClick={() => setSelectedReason(reason)}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="withdraw_bottom">
        <label className="withdraw_agree">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <span className="withdraw_checkbox">
            {isAgreed && <img src={check_icon} alt="" />}
          </span>
          <span>안내를 모두 확인했고, 삭제에 동의해요</span>
        </label>

        <button
          type="button"
          className="withdraw_button"
          onClick={() => {
            // TODO: 회원 탈퇴 API 연동
          }}
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
