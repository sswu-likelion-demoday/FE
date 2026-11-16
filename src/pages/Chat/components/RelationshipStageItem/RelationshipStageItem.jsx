import './RelationshipStageItem.scss';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import lock_icon from '../../../../assets/images/Chat/lock_icon.svg';
import lock_icon_2 from '../../../../assets/images/Chat/lock_icon_2.svg';
import check_icon from '../../../../assets/images/Chat/check_icon.svg';
import arrow_right from '../../../../assets/images/Chat/arrow_right.svg';
import quest_orb from '../../../../assets/images/Chat/quest_orb.svg';

const RelationshipStageItem = ({
    stage,
    title,
    status,
    quests = [],
    unlockText,
    waitingText,
    defaultOpen = false,
}) => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] =
        useState(defaultOpen);

    const isLocked =
        status === 'locked';

    const isComplete =
        status === 'complete';

    const isProgress =
        status === 'progress';

    const canToggle =
        isComplete || isProgress;

    const handleToggle = () => {
        if (!canToggle) return;

        setIsOpen((prev) => !prev);
    };

    const handleKeyDown = (event) => {
        if (!canToggle) return;

        if (
            event.key === 'Enter' ||
            event.key === ' '
        ) {
            event.preventDefault();
            handleToggle();
        }
    };

    const handleQuestClick = (quest) => {
        if (!quest.path) return;

        navigate(quest.path, {
            state: quest.state,
        });
    };

    if (isLocked) {
        return (
            <section className="relationship_stage_item relationship_stage_item_locked">
                <div className="relationship_stage_compact">
                    <span className="relationship_stage_number">
                        <img
                            src={lock_icon_2}
                            alt=""
                        />
                    </span>

                    <div className="relationship_stage_compact_text">
                        <strong className="relationship_stage_title">
                            {stage}단계 · {title}
                        </strong>

                        <span className="relationship_stage_locked_unlock">
                            {unlockText}
                        </span>
                    </div>
                </div>
            </section>
        );
    }

    if (!isOpen && isComplete) {
        return (
            <section className="relationship_stage_item relationship_stage_item_complete">
                <div
                    className="relationship_stage_complete_content"
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-expanded={false}
                >
                    <span className="relationship_stage_number">
                        <img
                            src={check_icon}
                            alt=""
                        />
                    </span>

                    <div className="relationship_stage_compact_text">
                        <strong className="relationship_stage_title">
                            {stage}단계 · {title}
                        </strong>

                        <span className="relationship_stage_complete_unlock">
                            {unlockText}
                        </span>
                    </div>

                    <span className="relationship_stage_status">
                        완료
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section
            className={`relationship_stage_item ${isProgress
                    ? 'relationship_stage_item_progress'
                    : ''
                } ${isComplete
                    ? 'relationship_stage_item_complete'
                    : ''
                }`}
        >
            <div
                className="relationship_stage_header"
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
            >
                <div className="relationship_stage_title_area">
                    <span className="relationship_stage_number">
                        {isComplete ? (
                            <img
                                src={check_icon}
                                alt=""
                            />
                        ) : (
                            stage
                        )}
                    </span>

                    <strong className="relationship_stage_title">
                        {stage}단계 · {title}
                    </strong>
                </div>

                <span className="relationship_stage_status">
                    {isComplete
                        ? '완료'
                        : '진행 중'}
                </span>
            </div>

            {isOpen && (
                <>
                    {quests.map((quest) => {
                        const isCurrentQuest =
                            !quest.complete &&
                            Boolean(quest.path);

                        return (
                            <div
                                className={`relationship_stage_quest ${quest.complete
                                        ? 'complete'
                                        : 'current'
                                    }`}
                                key={quest.id}
                            >
                                <div className="relationship_stage_quest_left">
                                    <span className="relationship_stage_quest_icon">
                                        {quest.complete ? (
                                            <img
                                                src={check_icon}
                                                alt=""
                                            />
                                        ) : (
                                            <img
                                                src={quest_orb}
                                                alt=""
                                                className="relationship_stage_quest_orb"
                                            />
                                        )}
                                    </span>

                                    <span>
                                        {quest.title}
                                    </span>
                                </div>

                                {isCurrentQuest && (
                                    <button
                                        type="button"
                                        className="relationship_stage_quest_right"
                                        onClick={() =>
                                            handleQuestClick(
                                                quest
                                            )
                                        }
                                    >
                                        <span>
                                            {waitingText ||
                                                '하러 가기'}
                                        </span>

                                        <img
                                            src={arrow_right}
                                            alt=""
                                        />
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    <div className="relationship_stage_unlock">
                        <img
                            src={
                                isComplete
                                    ? lock_icon_2
                                    : lock_icon
                            }
                            alt=""
                        />

                        <span>
                            {unlockText}
                        </span>
                    </div>
                </>
            )}
        </section>
    );
};

export default RelationshipStageItem;