import './QuestBanner.scss';

import quest_orb from '../../../../assets/images/Chat/quest_orb.svg';
import arrow_right from '../../../../assets/images/Chat/arrow_right.svg';
import lock_icon from '../../../../assets/images/Chat/lock_icon.svg';

const QuestBanner = ({
  stage,
  stageName,
  currentQuest,
  totalQuest,
  title,
  questLabel = '진행 중 퀘스트',
  unlockText,
}) => {
  return (
    <section className="quest_banner">
      <div className="quest_banner_header">
        <div className="quest_banner_status">
          <span className="quest_banner_step">
            {stage}단계
          </span>

          <strong className="quest_banner_status_text">
            {stageName}
          </strong>
        </div>

        <button
          type="button"
          className="quest_banner_quest"
        >
          <span>
            퀘스트 {currentQuest}/{totalQuest}
          </span>

          <img
            src={arrow_right}
            alt=""
            className="quest_banner_arrow"
          />
        </button>
      </div>

      <div className="quest_banner_progress">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={`quest_banner_bar ${index < stage ? 'quest_banner_bar_active' : ''
              }`}
          />
        ))}
      </div>

      <div className="quest_banner_card">
        <img
          src={quest_orb}
          alt=""
          className="quest_banner_logo"
        />

        <div className="quest_banner_card_text">
          <span className="quest_banner_label">
            {questLabel}
          </span>

          <strong className="quest_banner_title">
            {title}
          </strong>
        </div>
      </div>

      <div className="quest_banner_unlock">
        <img
          src={lock_icon}
          alt=""
          className="quest_banner_lock"
        />

        <p className="quest_banner_unlock_text">
          {unlockText}
        </p>
      </div>
    </section>
  );
};

export default QuestBanner;