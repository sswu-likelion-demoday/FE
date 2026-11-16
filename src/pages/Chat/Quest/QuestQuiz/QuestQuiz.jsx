import './QuestQuiz.scss';

import { useState } from 'react';
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

const quizOptions = [
    {
        id: 'A',
        text: '떡볶이',
    },
    {
        id: 'B',
        text: '파스타',
    },
    {
        id: 'C',
        text: '초밥',
    },
    {
        id: 'D',
        text: '마라탕',
    },
];

const QuestQuiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { chatId } = useParams();

    /*
     * AI 퀴즈는 기본적으로
     * 2단계 4번째 퀘스트
     */
    const currentStage =
        location.state?.stage ?? 2;

    const currentQuestNumber =
        location.state?.quest ?? 4;

    const currentStageData =
        getRelationshipStage(currentStage);

    const currentQuest =
        getQuest(
            currentStage,
            currentQuestNumber
        );

    const [
        selectedAnswer,
        setSelectedAnswer,
    ] = useState('B');

    const [result, setResult] =
        useState(null);

    const [
        showStageComplete,
        setShowStageComplete,
    ] = useState(false);

    const handleSubmit = () => {
        if (!selectedAnswer) return;

        if (selectedAnswer === 'B') {
            setResult('correct');
            return;
        }

        setResult('wrong');
    };

    const handleResultClose = () => {
        if (result === 'correct') {
            setResult(null);
            setShowStageComplete(true);

            return;
        }

        /*
         * 오답이어도 현재
         * 2단계 4/4 상태 유지
         */
        setResult(null);

        navigate(`/chat/${chatId}`, {
            state: {
                stage: currentStage,
                quest: currentQuestNumber,
            },
        });
    };

    const handleBack = () => {
        navigate(`/chat/${chatId}`, {
            state: {
                stage: currentStage,
                quest: currentQuestNumber,
            },
        });
    };

    const handleContinue = () => {
        navigate(`/chat/${chatId}`, {
            state: {
                stage: 3,
                quest: 1,
            },
        });
    };

    return (
        <div className="page">
            <div className="quest_quiz">
                <header className="quest_quiz_header">
                    <button
                        type="button"
                        className="quest_quiz_back"
                        onClick={handleBack}
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
                        ✦ {currentStageData.stage}단계{' '}
                        {currentStageData.stageName} 퀘스트
                    </span>

                    <h2 className="quest_quiz_title">
                        {currentQuest.title}
                    </h2>

                    <p className="quest_quiz_description">
                        대화에서 나온 이야기를 떠올려
                        보세요!
                    </p>

                    <div className="quest_quiz_question">
                        <span className="quest_quiz_question_icon">
                            Q
                        </span>

                        <strong>
                            달빛여우님이 가장 좋아하는 음식은?
                        </strong>
                    </div>

                    <div className="quest_quiz_options">
                        {quizOptions.map(
                            (option) => (
                                <button
                                    type="button"
                                    key={option.id}
                                    className={`quest_quiz_option ${selectedAnswer ===
                                            option.id
                                            ? 'quest_quiz_option_selected'
                                            : ''
                                        }`}
                                    onClick={() =>
                                        setSelectedAnswer(
                                            option.id
                                        )
                                    }
                                >
                                    <span className="quest_quiz_option_letter">
                                        {option.id}.
                                    </span>

                                    <span>
                                        {option.text}
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
                        disabled={!selectedAnswer}
                        onClick={handleSubmit}
                    >
                        선택 완료
                    </button>
                </div>

                {result && (
                    <ChatModal
                        type={result}
                        onClose={
                            handleResultClose
                        }
                    />
                )}

                {showStageComplete && (
                    <StageCompleteModal
                        stage={
                            currentStageData.stage
                        }
                        title={`${currentStageData.unlockTitle}가 해금됐어요!`}
                        reward="+10 수정구"
                        infoLabel="해금된 정보"
                        infoValue={
                            currentStageData.unlockTitle
                        }
                        profileButtonText="프로필에서 보기"
                        continueButtonText="대화 계속하기"
                        onProfile={() =>
                            navigate(
                                `/chat/${chatId}/profile`,
                                {
                                    state: {
                                        completedStage:
                                            2,
                                        currentStage:
                                            3,
                                        currentQuestNumber:
                                            1,
                                    },
                                }
                            )
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