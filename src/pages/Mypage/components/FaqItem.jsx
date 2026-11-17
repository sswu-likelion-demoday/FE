import "./FaqItem.scss";
import up_icon from "../../../assets/images/Mypage/up_icon.svg";
import down_icon from "../../../assets/images/Mypage/down_icon.svg";

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="faq_item">
      <button
        type="button"
        className="faq_question"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <div className="faq_question_text">
          <span>Q</span>
          <p>{question}</p>
        </div>

        <img src={isOpen ? up_icon : down_icon} alt="" className="faq_arrow" />
      </button>

      {isOpen && <div className="faq_answer">{answer}</div>}
    </div>
  );
};

export default FaqItem;
