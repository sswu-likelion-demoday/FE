import "./FaqItem.scss";

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

        <span className={`faq_arrow ${isOpen ? "open" : ""}`}>
          ⌄
        </span>
      </button>

      {isOpen && <div className="faq_answer">{answer}</div>}
    </div>
  );
};

export default FaqItem;