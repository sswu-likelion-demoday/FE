import './Relationship.scss';

import {
    useLocation,
    useNavigate,
} from 'react-router-dom';

import arrow_left from '../../../assets/images/Chat/arrow_left.svg';

import RelationshipSummaryCard from '../components/RelationshipSummaryCard/RelationshipSummaryCard';
import RelationshipStageItem from '../components/RelationshipStageItem/RelationshipStageItem';

import {
    relationshipStages,
} from '../data/relationshipData';

const Relationship = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isRelationshipComplete =
        location.state?.relationshipComplete === true;

    const currentStage =
        location.state?.stage ??
        (isRelationshipComplete ? 4 : 2);

    const currentQuestNumber =
        location.state?.quest ?? 4;

    const currentStageData =
        relationshipStages[currentStage];

    const completedQuest =
        isRelationshipComplete
            ? currentStageData.quests.length
            : currentQuestNumber - 1;

    const getStageStatus = (stage) => {
        if (isRelationshipComplete) {
            return 'complete';
        }

        if (stage < currentStage) {
            return 'complete';
        }

        if (stage === currentStage) {
            return 'progress';
        }

        return 'locked';
    };

    const getUnlockText = (stage) => {
        const stageData =
            relationshipStages[stage];

        const status =
            getStageStatus(stage);

        if (status === 'complete') {
            return `해금됨 · ${stageData.unlockTitle}`;
        }

        return `완료하면 해금 · ${stageData.unlockTitle}`;
    };

    const getStageQuests = (stage) => {
        const stageData =
            relationshipStages[stage];

        const status =
            getStageStatus(stage);

        if (status === 'locked') {
            return [];
        }

        if (status === 'complete') {
            return stageData.quests.map(
                (quest) => ({
                    id: quest.id,
                    title: quest.title,
                    complete: true,
                    path: undefined,
                    state: undefined,
                })
            );
        }

        return stageData.quests.map(
            (quest) => {
                const isCompleted =
                    quest.id < currentQuestNumber;

                const isCurrent =
                    quest.id === currentQuestNumber;

                return {
                    id: quest.id,
                    title: quest.title,
                    complete: isCompleted,

                    path: isCurrent
                        ? quest.path || '/chat/1'
                        : undefined,

                    state: isCurrent
                        ? {
                            stage: currentStage,
                            quest: currentQuestNumber,
                        }
                        : undefined,
                };
            }
        );
    };

    const handleBack = () => {
        navigate('/chat/1', {
            state: isRelationshipComplete
                ? {
                    relationshipComplete: true,
                    completedStage: 4,
                    currentStage: 4,
                    stage: 4,
                    quest: 4,
                }
                : {
                    stage: currentStage,
                    quest: currentQuestNumber,
                },
        });
    };

    return (
        <div className="page">
            <div className="relationship">
                <header className="relationship_header">
                    <button
                        type="button"
                        className="relationship_back"
                        onClick={handleBack}
                        aria-label="뒤로가기"
                    >
                        <img
                            src={arrow_left}
                            alt=""
                        />
                    </button>

                    <h1 className="relationship_title">
                        관계 단계
                    </h1>
                </header>

                <main className="relationship_content">
                    <RelationshipSummaryCard
                        stage={currentStage}
                        stageName={
                            isRelationshipComplete
                                ? '인연 완료'
                                : currentStageData.stageName
                        }
                        completedQuest={
                            completedQuest
                        }
                        totalQuest={
                            currentStageData.quests.length
                        }
                    />

                    <div className="relationship_stage_list">
                        {Object.values(
                            relationshipStages
                        ).map((stageData) => (
                            <RelationshipStageItem
                                key={stageData.stage}
                                stage={stageData.stage}
                                title={stageData.stageName}
                                status={getStageStatus(
                                    stageData.stage
                                )}
                                quests={getStageQuests(
                                    stageData.stage
                                )}
                                unlockText={getUnlockText(
                                    stageData.stage
                                )}
                                defaultOpen={
                                    stageData.stage ===
                                    currentStage
                                }
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Relationship;