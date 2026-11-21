import "./CategorySelectPage.scss";
import category1 from "../../../assets/images/Matching/category1.svg";
import category2 from "../../../assets/images/Matching/category2.svg";
import category3 from "../../../assets/images/Matching/category3.svg";
import category4 from "../../../assets/images/Matching/category4.svg";

const categories = [
  { id: "MEAL", label: "밥약", icon: category1 },
  { id: "MENTORING", label: "멘토링", icon: category2 },
  { id: "STUDY", label: "스터디", icon: category3 },
  { id: "EXERCISE", label: "운동", icon: category4 },
];

const CategorySelectPage = ({
  badgeCounts = {},
  onSelect,
  onRequestCategory,
}) => {
  const handleSelect = (categoryId) => {
    if (onSelect) onSelect(categoryId);
  };

  return (
    <section className="category_select" aria-label="카테고리 선택">
      <div className="category_select_grid">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="category_select_card"
            data-category={category.id}
            onClick={() => handleSelect(category.id)}
          >
            <img src={category.icon} alt="" />
            <span>
              {category.label}
              {badgeCounts[category.id] > 0 && (
                <span className="category_select_badge" aria-label={`새 매칭 ${badgeCounts[category.id]}건`}>
                  {badgeCounts[category.id]}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="category_select_request" onClick={onRequestCategory}>
        카테고리 생성 요청
      </button>
    </section>
  );
};

export default CategorySelectPage;
