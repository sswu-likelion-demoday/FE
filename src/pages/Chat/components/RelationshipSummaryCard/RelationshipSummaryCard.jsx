import './RelationshipSummaryCard.scss';
import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';
import profile_me from '../../../../assets/images/Chat/profile_me.svg';

const RelationshipSummaryCard = ({
    stage,
    stageName,
    completedQuest,
    totalQuest,
}) => {
    return (
        <section className="relationship_summary">
            <div className="relationship_summary_top">
                <div className="relationship_summary_profiles">
                    <div className="relationship_summary_profile relationship_summary_profile_me">
                        <img src={profile_me} alt="내 프로필" />
                        <span>나</span>
                    </div>

                    <div className="relationship_summary_profile relationship_summary_profile_partner">
                        <img src={profile_purple} alt="달빛여우 프로필" />
                        <span>달</span>
                    </div>
                </div>

                <div className="relationship_summary_info">
                    <span className="relationship_summary_relation">
                        달빛여우님과 나
                    </span>

                    <strong className="relationship_summary_stage">
                        {stage}단계 · {stageName}
                    </strong>
                </div>
            </div>

            <div className="relationship_summary_progress">
                {Array.from({ length: 4 }).map((_, index) => (
                    <span
                        key={index}
                        className={`relationship_summary_bar ${index < completedQuest ? 'relationship_summary_bar_active' : ''
                            }`}
                    />
                ))}
            </div>

            <p className="relationship_summary_quest">
                퀘스트 {totalQuest}개 중 {completedQuest}개 완료 ·{' '}
                {totalQuest - completedQuest}개 남았어요
            </p>
        </section>
    );
};

export default RelationshipSummaryCard;