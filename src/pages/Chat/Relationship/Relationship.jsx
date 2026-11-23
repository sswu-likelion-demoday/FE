import './Relationship.scss';

import {
    useLayoutEffect,
    useState,
} from 'react';

import {
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    getRelationshipDetail,
} from '../../../api/relationship';

import { getChatRoomDetail } from '../../../api/chat';

import arrow_left from '../../../assets/images/Chat/arrow_left.svg';

import RelationshipSummaryCard from '../components/RelationshipSummaryCard/RelationshipSummaryCard';
import RelationshipStageItem from '../components/RelationshipStageItem/RelationshipStageItem';

const Relationship = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { chatId } = useParams();

    const routeRelationshipId = location.state?.relationshipId;
    const [resolvedRelationshipId, setResolvedRelationshipId] = useState(null);
    const [resolvedPartner, setResolvedPartner] = useState(null);
    const relationshipId = routeRelationshipId ?? resolvedRelationshipId;

    const [
        relationshipDetail,
        setRelationshipDetail,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState('');

    useLayoutEffect(() => {
        let ignore = false;

        const fetchRelationship = async () => {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const chatRoom = routeRelationshipId
                    ? null
                    : await getChatRoomDetail(chatId);
                if (ignore) {
                    return;
                }

                const id = routeRelationshipId ?? chatRoom?.relationshipId;
                if (!id) {
                    throw new Error('관계 정보를 확인할 수 없습니다.');
                }

                const data = await getRelationshipDetail(id);
                if (ignore) {
                    return;
                }

                setResolvedRelationshipId(id);
                setResolvedPartner(chatRoom?.partner);
                setRelationshipDetail(data);
            } catch (error) {
                if (ignore) {
                    return;
                }

                if (
                    error.code ===
                    'RELATIONSHIP_NOT_FOUND' ||
                    error.code ===
                    'RELATIONSHIP_ENDED'
                ) {
                    navigate(
                        '/chat'
                    );
                    return;
                }

                if (
                    error.code ===
                    'RELATIONSHIP_ACCESS_DENIED'
                ) {
                    setErrorMessage(
                        '이 관계 정보에 접근할 수 없습니다.'
                    );
                    return;
                }

                setErrorMessage(
                    error.message ||
                    '관계 진행 정보를 불러오지 못했습니다.'
                );
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        fetchRelationship();

        return () => {
            ignore = true;
        };
    }, [chatId, routeRelationshipId, navigate]);

    const relationshipStatus =
        relationshipDetail
            ?.relationshipStatus;

    const isRelationshipComplete =
        relationshipStatus ===
        'COMPLETED';

    const currentStage =
        relationshipDetail
            ?.currentStage?.stage ??
        (isRelationshipComplete
            ? 4
            : 1);

    const currentStageName =
        relationshipDetail
            ?.currentStage?.name ??
        (isRelationshipComplete
            ? '인연 완료'
            : '');

    const stages =
        relationshipDetail?.stages ??
        [];

    const currentStageData =
        stages.find(
            (stage) =>
                stage.stage ===
                currentStage
        );

    const completedQuest =
        currentStageData
            ?.questProgress
            ?.completed ?? 0;

    const totalQuest =
        currentStageData
            ?.questProgress
            ?.total ?? 0;

    /*
     * API 상태를 기존
     * RelationshipStageItem 상태로 변환
     */
    const getStageStatus = (
        status
    ) => {
        if (
            status === 'COMPLETED'
        ) {
            return 'complete';
        }

        if (
            status === 'ACTIVE'
        ) {
            return 'progress';
        }

        return 'locked';
    };

    const getUnlockText = (
        stage
    ) => {
        const unlock =
            stage.unlock;

        if (!unlock?.label) {
            return '';
        }

        if (
            unlock.status ===
            'UNLOCKED'
        ) {
            return `해금됨 · ${unlock.label}`;
        }

        return `완료하면 해금 · ${unlock.label}`;
    };

    /*
     * 현재 ACTIVE 퀘스트만
     * 이동 가능하도록 처리
     */
    const getQuestPath = (
        quest
    ) => {
        if (
            quest.status !==
            'ACTIVE'
        ) {
            return undefined;
        }

        if (
            quest.type ===
            'AI_QUIZ'
        ) {
            return `/chat/${chatId}/quest/quiz`;
        }

        if (
            quest.type ===
            'MEETING_VERIFICATION'
        ) {
            return `/chat/${chatId}/quest/verification`;
        }

        /*
         * AI_ANALYSIS 퀘스트는
         * 채팅에서 자연스럽게 수행
         */
        return `/chat/${chatId}`;
    };

    const getStageQuests = (
        stage
    ) => {
        if (
            stage.status ===
            'LOCKED'
        ) {
            return [];
        }

        return (
            stage.quests ?? []
        ).map((quest, index) => {
            const isCompleted =
                quest.status ===
                'COMPLETED';

            const path =
                getQuestPath(
                    quest
                );

            return {
                id:
                    quest
                        .relationshipQuestId,
                title:
                    quest.title,
                complete:
                    isCompleted,

                path,

                state: path
                    ? {
                        relationshipId,
                        relationshipQuestId:
                            quest
                                .relationshipQuestId,
                        stage:
                            stage.stage,
                        quest: index + 1,
                    }
                    : undefined,
            };
        });
    };

    const handleBack = () => {
        navigate(
            `/chat/${chatId}`,
            {
                state: {
                    relationshipId,
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="page">
                <div className="relationship">
                    <p>
                        인연 정보를
                        불러오는 중이에요.
                    </p>
                </div>
            </div>
        );
    }

    if (
        errorMessage ||
        !relationshipDetail
    ) {
        return (
            <div className="page">
                <div className="relationship">
                    <p>
                        {errorMessage ||
                            '관계 정보를 불러오지 못했습니다.'}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/chat/${chatId}`
                            )
                        }
                    >
                        채팅으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="relationship">
                <header className="relationship_header">
                    <button
                        type="button"
                        className="relationship_back"
                        onClick={
                            handleBack
                        }
                        aria-label="뒤로가기"
                    >
                        <img
                            src={
                                arrow_left
                            }
                            alt=""
                        />
                    </button>

                    <h1 className="relationship_title">
                        관계 단계
                    </h1>
                </header>

                <main className="relationship_content">
                    <RelationshipSummaryCard
                        partnerNickname={
                            location.state?.partnerNickname ?? resolvedPartner?.nickname
                        }
                        partnerImageUrl={
                            location.state?.partnerImageUrl ??
                            (resolvedPartner?.profileImageUnlocked
                                ? resolvedPartner.profileImageUrl
                                : undefined)
                        }
                        stage={
                            currentStage
                        }
                        stageName={
                            isRelationshipComplete
                                ? '인연 완료'
                                : currentStageName
                        }
                        completedQuest={
                            completedQuest
                        }
                        totalQuest={
                            totalQuest
                        }
                    />

                    <div className="relationship_stage_list">
                        {stages.map(
                            (stage) => (
                                <RelationshipStageItem
                                    key={
                                        stage.stage
                                    }
                                    stage={
                                        stage.stage
                                    }
                                    title={
                                        stage.name
                                    }
                                    status={getStageStatus(
                                        stage.status
                                    )}
                                    quests={getStageQuests(
                                        stage
                                    )}
                                    unlockText={getUnlockText(
                                        stage
                                    )}
                                    defaultOpen={
                                        stage.status ===
                                        'ACTIVE'
                                    }
                                />
                            )
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Relationship;