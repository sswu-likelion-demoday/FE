import './QuestCompleteNotice.scss';

import star from '../../../../assets/images/Chat/star.svg';

const QuestCompleteNotice = ({ title }) => {
  return (
    <div className="quest_complete_notice">
      <img
        src={star}
        alt=""
        className="quest_complete_notice_icon"
      />

      <span>
        퀘스트 완료 · {title}
      </span>
    </div>
  );
};

export default QuestCompleteNotice;