import './StageCompleteModal.scss';

import unlock_orb from '../../../../assets/images/Chat/unlock_orb.svg';
import gem from '../../../../assets/images/Chat/gem.svg';
import copy from '../../../../assets/images/Chat/copy.svg';

const StageCompleteModal = ({
    stage = 2,
    title = '취미 · MBTI가 해금됐어요!',
    reward = '+10 수정구',
    infoLabel = '해금된 정보',
    infoValue = '독서, 여행, 게임 · INFJ',
    profileButtonText = '프로필에서 보기',
    continueButtonText = '대화 계속하기',
    onProfile,
    onContinue,
}) => {
    return (
        <div className="stage_complete_overlay">
            <div className="stage_complete_modal">
                <img
                    src={unlock_orb}
                    alt=""
                    className="stage_complete_orb"
                />

                <span className="stage_complete_badge">
                    {stage}단계 완료
                </span>

                <h2 className="stage_complete_title">
                    {title}
                </h2>

                <div className="stage_complete_reward">
                    <img src={gem} alt="" />
                    <span>{reward}</span>
                </div>

                <div className="stage_complete_info">
                    <span className="stage_complete_info_label">
                        {infoLabel}
                    </span>

                    <div className="stage_complete_info_value_row">
                        <strong className="stage_complete_info_value">
                            {infoValue}
                        </strong>

                        {stage === 4 && (
                            <button
                                type="button"
                                className="stage_complete_copy"
                                onClick={() => navigator.clipboard.writeText(infoValue)}
                                aria-label="카카오톡 ID 복사"
                            >
                                <img src={copy} alt="" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="stage_complete_buttons">
                    <button
                        type="button"
                        className="stage_complete_profile"
                        onClick={onProfile}
                    >
                        {profileButtonText}
                    </button>

                    <button
                        type="button"
                        className="stage_complete_continue"
                        onClick={onContinue}
                    >
                        {continueButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StageCompleteModal;