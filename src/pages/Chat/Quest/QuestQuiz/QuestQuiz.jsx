import './QuestQuiz.scss';

import {
    useEffect,
    useState,
} from 'react';

import {
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';

import ChatModal from '../../components/ChatModal/ChatModal';
import StageCompleteModal from '../../components/StageCompleteModal/StageCompleteModal';

import {
    getRelationshipStage,
    getQuest,
} from '../../data/relationshipData';

import {
    getAiQuiz,
    submitAiQuizAnswer,
} from '../../../../api/quest';

import {
    getChatRoomDetail,
} from '../../../../api/chat';

const OPTION_LETTERS = [
    'A',
    'B',
    'C',
    'D',
];

const QuestQuiz = () => {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const { chatId } =
        useParams();

    const [
        relationshipId,
        setRelationshipId,
    ] = useState(
        location.state
            ?.relationshipId ??
        null
    );

    const [
        relationshipQuestId,
        setRelationshipQuestId,
    ] = useState(
        location.state
            ?.relationshipQuestId ??
        null
    );

    const [
        quizData,
        setQuizData,
    ] = useState(null);

    const [
        selectedAnswer,
        setSelectedAnswer,
    ] = useState(null);

    const [
        quizResult,
        setQuizResult,
    ] = useState(null);

    const [
        showStageComplete,
        setShowStageComplete,
    ] = useState(false);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState('');

    /*
     * location.state가 없는 직접 접근에도 대응.
     *
     * 채팅방 상세에서
     * relationshipId와 현재 퀘스트 ID를 찾는다.
     */
    useEffect(() => {
        const fetchQuiz =
            async () => {
                try {
                    setIsLoading(true);
                    setErrorMessage('');

                    let resolvedRelationshipId =
                        relationshipId;

                    let resolvedRelationshipQuestId =
                        relationshipQuestId;

                    if (
                        !resolvedRelationshipId ||
                        !resolvedRelationshipQuestId
                    ) {
                        const chatRoom =
                            await getChatRoomDetail(
                                chatId
                            );

                        resolvedRelationshipId =
                            chatRoom.relationshipId;

                        resolvedRelationshipQuestId =
                            chatRoom.currentQuest
                                ?.relationshipQuestId;

                        setRelationshipId(
                            resolvedRelationshipId
                        );

                        setRelationshipQuestId(
                            resolvedRelationshipQuestId
                        );
                    }

                    if (
                        !resolvedRelationshipId ||
                        !resolvedRelationshipQuestId
                    ) {
                        throw new Error(
                            '진행 중인 AI 퀴즈를 찾을 수 없습니다.'
                        );
                    }

                    const data =
                        await getAiQuiz(
                            resolvedRelationshipId,
                            resolvedRelationshipQuestId
                        );

                    setQuizData(data);

                    /*
                     * API에서 받은 ID를
                     * 최종 기준으로 다시 저장
                     */
                    setRelationshipQuestId(
                        data.relationshipQuestId
                    );
                } catch (error) {
                    console.error(
                        'AI 퀴즈 조회 실패:',
                        error
                    );

                    if (
                        error.code ===
                        'QUIZ_ALREADY_SUBMITTED'
                    ) {
                        navigate(
                            `/chat/${chatId}/relationship`,
                            {
                                state: {
                                    relationshipId,
                                },
                            }
                        );

                        return;
                    }

                    if (
                        error.code ===
                        'QUEST_NOT_ACTIVE' ||
                        error.code ===
                        'RELATIONSHIP_QUEST_NOT_FOUND' ||
                        error.code ===
                        'QUEST_TYPE_MISMATCH'
                    ) {
                        navigate(
                            `/chat/${chatId}/relationship`,
                            {
                                state: {
                                    relationshipId,
                                },
                            }
                        );

                        return;
                    }

                    if (
                        error.code ===
                        'RELATIONSHIP_NOT_FOUND' ||
                        error.code ===
                        'RELATIONSHIP_ACCESS_DENIED'
                    ) {
                        navigate('/chat');

                        return;
                    }

                    setErrorMessage(
                        error.message ||
                        'AI 퀴즈를 불러오지 못했습니다.'
                    );
                } finally {
                    setIsLoading(false);
                }
            };

        fetchQuiz();
    }, [
        chatId,
        relationshipId,
        relationshipQuestId,
        navigate,
    ]);

    /*
     * 서버에서 받은 단계가 기준.
     *
     * 로딩 전에는 location.state를
     * fallback으로 사용.
     */
    const currentStage =
        quizData?.stage?.stage ??
        location.state?.stage ??
        2;

    const currentQuestNumber =
        location.state?.quest ??
        4;

    const currentStageData =
        getRelationshipStage(
            currentStage
        );

    const localCurrentQuest =
        getQuest(
            currentStage,
            currentQuestNumber
        );

    /*
     * 답변 제출
     */
    const handleSubmit =
        async () => {
            if (
                !selectedAnswer ||
                !relationshipId ||
                !relationshipQuestId ||
                isSubmitting
            ) {
                return;
            }

            try {
                setIsSubmitting(true);

                const data =
                    await submitAiQuizAnswer(
                        relationshipId,
                        relationshipQuestId,
                        selectedAnswer
                    );

                /*
                 * 재도전은 없으므로
                 * 제출 완료 후 결과를 고정.
                 */
                setQuizResult(data);
            } catch (error) {
                console.error(
                    'AI 퀴즈 답변 제출 실패:',
                    error
                );

                if (
                    error.code ===
                    'QUIZ_ALREADY_SUBMITTED'
                ) {
                    navigate(
                        `/chat/${chatId}/relationship`,
                        {
                            state: {
                                relationshipId,
                            },
                        }
                    );

                    return;
                }

                if (
                    error.code ===
                    'QUEST_NOT_ACTIVE' ||
                    error.code ===
                    'RELATIONSHIP_QUEST_NOT_FOUND' ||
                    error.code ===
                    'QUEST_TYPE_MISMATCH'
                ) {
                    navigate(
                        `/chat/${chatId}/relationship`,
                        {
                            state: {
                                relationshipId,
                            },
                        }
                    );

                    return;
                }

                if (
                    error.code ===
                    'INVALID_QUIZ_ANSWER'
                ) {
                    /*
                     * 선택지가 서버와 맞지 않으면
                     * 퀴즈를 다시 조회하게 한다.
                     */
                    setSelectedAnswer(
                        null
                    );

                    try {
                        const refreshedQuiz =
                            await getAiQuiz(
                                relationshipId,
                                relationshipQuestId
                            );

                        setQuizData(
                            refreshedQuiz
                        );
                    } catch (
                    refreshError
                    ) {
                        console.error(
                            'AI 퀴즈 재조회 실패:',
                            refreshError
                        );
                    }

                    return;
                }

                if (
                    error.code ===
                    'RELATIONSHIP_NOT_FOUND' ||
                    error.code ===
                    'RELATIONSHIP_ACCESS_DENIED'
                ) {
                    navigate('/chat');

                    return;
                }

                window.alert(
                    error.message ||
                    '퀴즈 답변 제출에 실패했습니다.'
                );
            } finally {
                setIsSubmitting(
                    false
                );
            }
        };

    /*
     * 정답/오답 결과 모달 닫기
     */
    const handleResultClose =
        () => {
            if (!quizResult) {
                return;
            }

            /*
             * 둘 다 제출해서
             * 현재 단계까지 완료된 경우
             *
             * 정답/오답 여부와 관계없이
             * 단계 완료 모달을 보여준다.
             */
            if (
                quizResult
                    .completion
                    ?.stageCompleted
            ) {
                setQuizResult(null);

                setShowStageComplete(
                    true
                );

                return;
            }

            /*
             * 나는 제출했지만
             * 상대방이 아직 제출하지 않은 상태.
             *
             * 다시 퀴즈를 풀 수 없으므로
             * 관계 진행 화면으로 이동.
             */
            setQuizResult(null);

            navigate(
                `/chat/${chatId}/relationship`,
                {
                    state: {
                        relationshipId,
                        stage:
                            currentStage,
                        quest:
                            currentQuestNumber,
                        waitingForPartner:
                            quizResult
                                .partnerParticipationStatus ===
                            'NOT_SUBMITTED',
                    },
                }
            );
        };

    const handleBack = () => {
        navigate(
            `/chat/${chatId}`
        );
    };

    const handleContinue = () => {
        const newStage =
            quizResult
                ?.completion
                ?.newStage ??
            currentStage + 1;

        navigate(
            `/chat/${chatId}`,
            {
                state: {
                    stage:
                        newStage,
                    quest: 1,
                },
            }
        );
    };

    const handleProfile = () => {
        const completion =
            quizResult
                ?.completion;

        navigate(
            `/chat/${chatId}/profile`,
            {
                state: {
                    relationshipId,

                    completedStage:
                        completion
                            ?.completedStage ??
                        currentStage,

                    currentStage:
                        completion
                            ?.newStage ??
                        currentStage + 1,

                    currentQuestNumber:
                        1,
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="page">
                <div className="quest_quiz">
                    <p>
                        AI 퀴즈를 만들고
                        있어요.
                    </p>
                </div>
            </div>
        );
    }

    if (
        errorMessage ||
        !quizData
    ) {
        return (
            <div className="page">
                <div className="quest_quiz">
                    <p>
                        {errorMessage ||
                            'AI 퀴즈를 불러오지 못했습니다.'}
                    </p>

                    <button
                        type="button"
                        onClick={
                            handleBack
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
            <div className="quest_quiz">
                <header className="quest_quiz_header">
                    <button
                        type="button"
                        className="quest_quiz_back"
                        onClick={
                            handleBack
                        }
                        aria-label="뒤로가기"
                    >
                        <img
                            src={arrow_left}
                            alt=""
                        />
                    </button>

                    <h1 className="quest_quiz_header_title">
                        퀘스트
                    </h1>
                </header>

                <main className="quest_quiz_content">
                    <span className="quest_quiz_stage">
                        ✦{' '}
                        {
                            quizData.stage
                                ?.stage
                        }
                        단계{' '}
                        {
                            quizData.stage
                                ?.name
                        }{' '}
                        퀘스트
                    </span>

                    <h2 className="quest_quiz_title">
                        {
                            quizData.title ||
                            localCurrentQuest
                                ?.title
                        }
                    </h2>

                    <p className="quest_quiz_description">
                        대화에서 나온 이야기를
                        떠올려 보세요!
                    </p>

                    <div className="quest_quiz_question">
                        <span className="quest_quiz_question_icon">
                            Q
                        </span>

                        <strong>
                            {
                                quizData.question
                            }
                        </strong>
                    </div>

                    <div className="quest_quiz_options">
                        {(
                            quizData.options ??
                            []
                        ).map(
                            (
                                option,
                                index
                            ) => (
                                <button
                                    type="button"
                                    key={
                                        option.optionId
                                    }
                                    className={`quest_quiz_option ${selectedAnswer ===
                                        option.optionId
                                        ? 'quest_quiz_option_selected'
                                        : ''
                                        }`}
                                    disabled={
                                        isSubmitting ||
                                        Boolean(
                                            quizResult
                                        )
                                    }
                                    onClick={() =>
                                        setSelectedAnswer(
                                            option.optionId
                                        )
                                    }
                                >
                                    <span className="quest_quiz_option_letter">
                                        {OPTION_LETTERS[
                                            index
                                        ] ??
                                            option.optionId}
                                        .
                                    </span>

                                    <span>
                                        {
                                            option.content
                                        }
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                </main>

                <div className="quest_quiz_bottom">
                    <button
                        type="button"
                        className="quest_quiz_submit"
                        disabled={
                            !selectedAnswer ||
                            isSubmitting ||
                            Boolean(
                                quizResult
                            )
                        }
                        onClick={
                            handleSubmit
                        }
                    >
                        {isSubmitting
                            ? '제출 중...'
                            : '선택 완료'}
                    </button>
                </div>

                {quizResult && (
                    <ChatModal
                        type={
                            quizResult.correct
                                ? 'correct'
                                : 'wrong'
                        }
                        correctAnswer={
                            quizResult
                                .correctAnswer
                        }
                        reward={
                            quizResult.reward
                        }
                        partnerParticipationStatus={
                            quizResult
                                .partnerParticipationStatus
                        }
                        onClose={
                            handleResultClose
                        }
                    />
                )}

                {showStageComplete && (
                    <StageCompleteModal
                        stage={
                            quizResult
                                ?.completion
                                ?.completedStage ??
                            currentStageData.stage
                        }
                        title={`${quizResult
                            ?.completion
                            ?.unlockLabel ??
                            currentStageData
                                .unlockTitle
                            }가 해금됐어요!`}
                        reward=""
                        infoLabel="해금된 정보"
                        infoValue={
                            quizResult
                                ?.completion
                                ?.unlockLabel ??
                            currentStageData
                                .unlockTitle
                        }
                        profileButtonText="프로필에서 보기"
                        continueButtonText="대화 계속하기"
                        onProfile={
                            handleProfile
                        }
                        onContinue={
                            handleContinue
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default QuestQuiz;