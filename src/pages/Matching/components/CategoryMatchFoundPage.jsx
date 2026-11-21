import "./CategoryMatchFoundPage.scss";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";
import card_matching from "../../../assets/images/Matching/card_matching.svg";

const CategoryMatchFoundPage = ({ onViewResults }) => {
  return (
    <section className="category_found" aria-label="카테고리 매칭 발견">
      <h2>조건에 맞는<br />수정을 발견했어요</h2>
      <div className="category_found_artwork">
        <img className="category_found_image" src={card_matching} alt="발견한 수정을 나타내는 물음표 카드" />
      </div>
      <p className="category_found_description">어떤 수정인지 확인해보세요!</p>
      <p className="category_found_notice">연락처를 확인해도 슬롯이 차감되지 않아요</p>
      <div className="category_found_bottom">
        <BottomButton onClick={onViewResults}>매칭된 수정 확인하기</BottomButton>
      </div>
    </section>
  );
};

export default CategoryMatchFoundPage;
