import './ChatModal.scss';

import quest_false from '../../../../assets/images/Chat/quest_false.svg';
import quest_true from '../../../../assets/images/Chat/quest_true.svg';
import eye from '../../../../assets/images/Chat/eye.svg';
import gem from '../../../../assets/images/Chat/gem.svg';

const ChatModal = ({
    type,
    onClose,
    onConfirm,
    correctAnswer,
    correctAnswerLetter,
    partnerName = '상대방',
    reward,
    partnerParticipationStatus,
}) => {
    const isCorrect =
        type === 'correct';

    const isWrong =
        type === 'wrong';

    const isVerification =
        type ===
        'verification';

    const isBlockConfirm =
        type ===
        'blockConfirm';

    const isBlockDone =
        type ===
        'blockDone';

    const isLeaveConfirm =
        type ===
        'leaveConfirm';

    const partnerLabel = partnerName === '상대방' ? partnerName : partnerName + '님';

    if (isBlockConfirm) {
        return (
            <div className="chat_modal_overlay">
                <div className="chat_modal chat_modal_confirm">
                    <h2 className="chat_modal_confirm_title">
                        {partnerLabel}을 차단할까요?
                    </h2>

                    <div className="chat_modal_confirm_buttons">
                        <button
                            type="button"
                            className="chat_modal_cancel"
                            onClick={onClose}
                        >
                            취소
                        </button>

                        <button
                            type="button"
                            className="chat_modal_danger"
                            onClick={
                                onConfirm
                            }
                        >
                            차단하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isBlockDone) {
        return (
            <div className="chat_modal_overlay">
                <div className="chat_modal chat_modal_confirm">
                    <h2 className="chat_modal_confirm_title">
                        {partnerLabel}을 차단했어요
                    </h2>

                    <button
                        type="button"
                        className="chat_modal_button"
                        onClick={onClose}
                    >
                        확인
                    </button>
                </div>
            </div>
        );
    }

    if (isLeaveConfirm) {
        return (
            <div className="chat_modal_overlay">
                <div className="chat_modal chat_modal_confirm">
                    <h2 className="chat_modal_confirm_title">
                        {partnerLabel}과
                        <br />
                        관계를 종료할까요?
                    </h2>

                    <div className="chat_modal_confirm_buttons">
                        <button
                            type="button"
                            className="chat_modal_cancel"
                            onClick={onClose}
                        >
                            취소
                        </button>

                        <button
                            type="button"
                            className="chat_modal_danger"
                            onClick={
                                onConfirm
                            }
                        >
                            종료
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat_modal_overlay">
            <div className="chat_modal">
                {!isVerification && (
                    <img
                        src={
                            isCorrect
                                ? quest_true
                                : quest_false
                        }
                        alt=""
                        className={`chat_modal_image ${isCorrect
                                ? 'chat_modal_image_correct'
                                : 'chat_modal_image_wrong'
                            }`}
                    />
                )}

                <h2 className="chat_modal_title">
                    {isVerification
                        ? '인증 완료!'
                        : isCorrect
                            ? '정답이에요!'
                            : '아쉬워요, 오답이에요!'}
                </h2>

                {isCorrect &&
                    reward > 0 && (
                        <div className="chat_modal_reward">
                            <img
                                src={gem}
                                alt=""
                            />

                            <span>
                                +{reward} 수정구
                            </span>
                        </div>
                    )}

                {isWrong &&
                    correctAnswer && (
                        <div className="chat_modal_answer">
                            <img
                                src={eye}
                                alt=""
                            />

                            <span>
                                정답은{' '}
                                <strong>
                                    {correctAnswerLetter && `${correctAnswerLetter}. `}
                                    {
                                        correctAnswer
                                            .content
                                    }
                                </strong>
                                였어요.
                            </span>
                        </div>
                    )}

                {!isVerification &&
                    partnerParticipationStatus ===
                    'NOT_SUBMITTED' && (
                        <p>
                            상대방도 퀴즈를
                            완료하면 다음 단계로
                            함께 넘어가요.
                        </p>
                    )}

                <button
                    type="button"
                    className="chat_modal_button"
                    onClick={onClose}
                >
                    {isVerification
                        ? '채팅으로 돌아가기'
                        : '대화로 돌아가기'}
                </button>
            </div>
        </div>
    );
};

export default ChatModal;