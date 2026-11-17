import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerCenter.scss";
import FaqItem from "../../components/FaqItem";
import MypageHeader from "../../components/MypageHeader";
import chat_icon from "../../../../assets/images/Mypage/chat_icon.svg";
import bell_icon from "../../../../assets/images/Mypage/bell_icon.svg";

const faqList = [
  {
    question: "수정은 어떻게 모으나요?",
    answer: "채팅 퀘스트를 완료하거나 관계 단계를 올리면 수정을 받아요.",
  },
  {
    question: "관계 단계는 어떻게 올라가나요?",
    answer: "관계 단계에 대한 안내입니다.",
  },
  {
    question: "차단을 해제하고 싶어요",
    answer: "차단 해제에 대한 안내입니다.",
  },
  {
    question: "학번을 바꾸고 싶어요",
    answer: "학번 변경에 대한 안내입니다.",
  },
];

function CustomerCenter() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="page CustomerCenter_wrap">
      <MypageHeader title="고객센터" onBack={() => navigate("/mypage")} />

      <div className="CustomerCenter_main">
        <div className="customercenter_top">
          <h2>무엇을 도와드릴까요?</h2>
          <p>평일 10:00 ~ 18:00에 답변드려요</p>
        </div>

        <div className="customercenter_cards">
          <div className="customercenter_card inquiry">
            <img src={chat_icon} alt="" />
            <p>1:1 문의하기</p>
            <span>답변을 알림으로 확인</span>
          </div>

          <div className="customercenter_card history">
            <img src={bell_icon} alt="" />
            <p>문의 내역</p>
            <span>답변 대기 1건</span>
          </div>
        </div>

        <div className="customercenter_faq">
          <h3>자주 묻는 질문</h3>
          <div className="customercenter_faq_list">
            {faqList.map((faq, index) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerCenter;
