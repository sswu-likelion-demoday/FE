import "./CategoryMatchingWaitingPage.scss";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import normal_matching from "../../../assets/images/Matching/normal_matching.svg";

const CategoryMatchingWaitingPage = ({ onConfirm }) => {
  return (
    <section className="category_waiting" aria-label="카테고리 매칭 대기">
      <h2>매칭신청 완료!</h2>
      <div className="category_waiting_artwork">
        <img className="category_waiting_image" src={normal_matching} alt="물음표가 있는 보라색 수정구" />
      </div>
      <p className="category_waiting_description">
        <span>조건에 맞는 수정을 찾고 있어요</span>
        <span>나타나면 알려드릴게요</span>
      </p>
      <div className="category_waiting_bottom">
        <BottomButton onClick={onConfirm}>확인</BottomButton>
      </div>
    </section>
  );
};

export default CategoryMatchingWaitingPage;
