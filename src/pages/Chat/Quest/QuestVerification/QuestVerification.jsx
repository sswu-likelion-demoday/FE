import './QuestVerification.scss';

import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    submitMeetingVerification,
} from '../../../../api/quest';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';
import ChatModal from '../../components/ChatModal/ChatModal';

const QuestVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { chatId } = useParams();

    const fileInputRef = useRef(null);

    const relationshipId =
        location.state?.relationshipId;

    const relationshipQuestId =
        location.state?.relationshipQuestId;

    const [image, setImage] =
        useState(null);

    const [
        imageFile,
        setImageFile,
    ] = useState(null);

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        showCompleteModal,
        setShowCompleteModal,
    ] = useState(false);

    const [
        verificationResult,
        setVerificationResult,
    ] = useState(null);

    /*
     * 미리보기 Object URL 정리
     */
    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(
                    image
                );
            }
        };
    }, [image]);

    const handleUploadClick = () => {
        if (isSubmitting) {
            return;
        }

        fileInputRef.current?.click();
    };

    const handleImageChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        /*
         * 기존 미리보기 URL 정리
         */
        if (image) {
            URL.revokeObjectURL(
                image
            );
        }

        const imageUrl =
            URL.createObjectURL(file);

        /*
         * 화면 표시용 URL
         */
        setImage(imageUrl);

        /*
         * 실제 API 업로드용 File
         */
        setImageFile(file);
    };

    const handleVerify =
        async () => {
            if (
                !imageFile ||
                isSubmitting
            ) {
                return;
            }

            if (
                !relationshipId ||
                !relationshipQuestId
            ) {
                window.alert(
                    '퀘스트 정보를 확인할 수 없습니다.'
                );

                navigate(
                    `/chat/${chatId}`
                );

                return;
            }

            try {
                setIsSubmitting(
                    true
                );

                const result =
                    await submitMeetingVerification(
                        relationshipId,
                        relationshipQuestId,
                        imageFile
                    );

                setVerificationResult(
                    result
                );

                /*
                 * 인증 성공
                 */
                if (
                    result.verified ===
                    true
                ) {
                    setShowCompleteModal(
                        true
                    );

                    return;
                }

                /*
                 * API는 성공 응답이지만
                 * 인증 자체는 실패한 경우
                 */
                window.alert(
                    '만남 인증에 실패했습니다. 다른 사진으로 다시 시도해주세요.'
                );
            } catch (error) {
                console.error(
                    '만남 인증 실패:',
                    error
                );

                if (
                    error.code ===
                    'MEETING_ALREADY_VERIFIED'
                ) {
                    window.alert(
                        '이미 만남 인증을 완료했습니다.'
                    );

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
                    'IMAGE_REQUIRED'
                ) {
                    window.alert(
                        '인증 사진을 선택해주세요.'
                    );

                    return;
                }

                if (
                    error.code ===
                    'INVALID_IMAGE_FORMAT'
                ) {
                    window.alert(
                        '지원하지 않는 이미지 형식입니다.'
                    );

                    return;
                }

                if (
                    error.code ===
                    'QUEST_NOT_ACTIVE'
                ) {
                    window.alert(
                        '현재 진행할 수 없는 퀘스트입니다.'
                    );

                    navigate(
                        `/chat/${chatId}`
                    );

                    return;
                }

                if (
                    error.code ===
                    'MEETING_VERIFICATION_FAILED'
                ) {
                    window.alert(
                        '만남 인증에 실패했습니다. 다른 사진으로 다시 시도해주세요.'
                    );

                    return;
                }

                if (
                    error.code ===
                    'MEETING_ANALYSIS_FAILED'
                ) {
                    window.alert(
                        '사진 분석 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
                    );

                    return;
                }

                window.alert(
                    error.message ||
                    '만남 인증에 실패했습니다.'
                );
            } finally {
                setIsSubmitting(
                    false
                );
            }
        };

    const handleComplete = () => {
        setShowCompleteModal(
            false
        );

        /*
         * 두 사람 모두 인증 완료
         * → 관계 완료
         */
        if (
            verificationResult
                ?.relationshipCompleted ===
            true
        ) {
            navigate(
                `/chat/${chatId}`,
                {
                    state: {
                        relationshipComplete:
                            true,
                        completedStage:
                            4,
                        currentStage:
                            4,
                        stage:
                            4,
                        quest:
                            4,
                    },
                }
            );

            return;
        }

        /*
         * 내 인증만 완료
         * → 상대방 인증 대기
         *
         * 실제 관계 상태는
         * WebSocket / REST 상세 조회로
         * 다시 갱신된다.
         */
        navigate(
            `/chat/${chatId}`,
            {
                state: {
                    relationshipId,
                    verificationCompleted:
                        true,
                },
            }
        );
    };

    return (
        <div className="page">
            <div className="quest_verification">
                <header className="quest_verification_header">
                    <button
                        type="button"
                        className="quest_verification_back"
                        onClick={() =>
                            navigate(-1)
                        }
                        aria-label="뒤로가기"
                        disabled={
                            isSubmitting
                        }
                    >
                        <img
                            src={
                                arrow_left
                            }
                            alt=""
                        />
                    </button>

                    <h1 className="quest_verification_header_title">
                        퀘스트
                    </h1>
                </header>

                <main className="quest_verification_content">
                    <span className="quest_verification_stage">
                        ✦ 4단계 인연 퀘스트
                    </span>

                    <h2 className="quest_verification_title">
                        첫 만남 상호 인증하기
                    </h2>

                    <p className="quest_verification_description">
                        드디어 수정이와
                        만났나요?
                        실제로 만났다면 첫
                        만남을 인증해주세요!
                        <br />
                        얼굴이 나오지 않아도
                        괜찮아요.
                    </p>

                    <input
                        ref={
                            fileInputRef
                        }
                        type="file"
                        accept="image/*"
                        className="quest_verification_input"
                        onChange={
                            handleImageChange
                        }
                        disabled={
                            isSubmitting
                        }
                    />

                    {!image ? (
                        <div className="quest_verification_upload_box">
                            <div className="quest_verification_upload_text">
                                <strong>
                                    인증 사진
                                    추가하기
                                </strong>

                                <span>
                                    만난 장소를
                                    확인할 수 있는
                                    사진을
                                    올려주세요.
                                </span>
                            </div>

                            <button
                                type="button"
                                className="quest_verification_upload_button"
                                onClick={
                                    handleUploadClick
                                }
                                disabled={
                                    isSubmitting
                                }
                            >
                                이미지 업로드
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="quest_verification_preview">
                                <img
                                    src={
                                        image
                                    }
                                    alt="인증 사진"
                                />
                            </div>

                            <button
                                type="button"
                                className="quest_verification_retry"
                                onClick={
                                    handleUploadClick
                                }
                                disabled={
                                    isSubmitting
                                }
                            >
                                다시 업로드하기
                            </button>
                        </>
                    )}
                </main>

                <div className="quest_verification_bottom">
                    <button
                        type="button"
                        className="quest_verification_submit"
                        disabled={
                            !imageFile ||
                            isSubmitting
                        }
                        onClick={
                            handleVerify
                        }
                    >
                        {isSubmitting
                            ? '인증 중...'
                            : '인증하기'}
                    </button>
                </div>

                {showCompleteModal && (
                    <ChatModal
                        type="verification"
                        onClose={
                            handleComplete
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default QuestVerification;