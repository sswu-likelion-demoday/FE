import './QuestVerification.scss';

import { useRef, useState } from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';
import ChatModal from '../../components/ChatModal/ChatModal';

const QuestVerification = () => {
    const navigate = useNavigate();
    const { chatId } = useParams();

    const fileInputRef = useRef(null);

    const [image, setImage] =
        useState(null);

    const [
        showCompleteModal,
        setShowCompleteModal,
    ] = useState(false);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        const imageUrl =
            URL.createObjectURL(file);

        setImage(imageUrl);
    };

    const handleVerify = () => {
        if (!image) return;

        setShowCompleteModal(true);
    };

    const handleComplete = () => {
        setShowCompleteModal(false);

        navigate(`/chat/${chatId}`, {
            state: {
                relationshipComplete: true,
                completedStage: 4,
                currentStage: 4,
                stage: 4,
                quest: 4,

                // 인증 직후에만 해금 모달 표시
                showUnlockModal: true,
            },
        });
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
                    >
                        <img
                            src={arrow_left}
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
                        드디어 수정이와 만났나요?
                        실제로 만났다면 첫 만남을
                        인증해주세요!
                        <br />
                        얼굴이 나오지 않아도 괜찮아요.
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="quest_verification_input"
                        onChange={
                            handleImageChange
                        }
                    />

                    {!image ? (
                        <div className="quest_verification_upload_box">
                            <div className="quest_verification_upload_text">
                                <strong>
                                    인증 사진 추가하기
                                </strong>

                                <span>
                                    만난 장소를 확인할 수 있는
                                    사진을 올려주세요.
                                </span>
                            </div>

                            <button
                                type="button"
                                className="quest_verification_upload_button"
                                onClick={
                                    handleUploadClick
                                }
                            >
                                이미지 업로드
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="quest_verification_preview">
                                <img
                                    src={image}
                                    alt="인증 사진"
                                />
                            </div>

                            <button
                                type="button"
                                className="quest_verification_retry"
                                onClick={
                                    handleUploadClick
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
                        disabled={!image}
                        onClick={handleVerify}
                    >
                        인증하기
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