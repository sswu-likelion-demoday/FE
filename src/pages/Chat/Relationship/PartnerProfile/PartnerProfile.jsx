import './PartnerProfile.scss';

import { useNavigate } from 'react-router-dom';

import arrow_left from '../../../../assets/images/Chat/arrow_left.svg';
import profile_purple from '../../../../assets/images/Chat/profile_purple.svg';
import lock_icon from '../../../../assets/images/Chat/lock_icon.svg';

const PartnerProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="partner_profile">
        <header className="partner_profile_header">
          <button
            type="button"
            className="partner_profile_back"
            onClick={() => navigate('/chat/1')}
            aria-label="채팅방으로 돌아가기"
          >
            <img src={arrow_left} alt="" />
          </button>

          <h1 className="partner_profile_header_title">
            달빛여우님의 프로필
          </h1>
        </header>

        <main className="partner_profile_content">
          <div className="partner_profile_main">
            <div className="partner_profile_image_wrap">
              <img
                src={profile_purple}
                alt="달빛여우 프로필"
                className="partner_profile_image"
              />

              <div className="partner_profile_lock">
                <img src={lock_icon} alt="" />
              </div>
            </div>

            <h2 className="partner_profile_name">
              달빛여우
            </h2>

            <span className="partner_profile_stage">
              2단계 · 알아가는 중
            </span>

            <p className="partner_profile_guide">
              프로필 사진은 4단계 인연에서 공개돼요
            </p>
          </div>

          <section className="partner_profile_card">
            <div className="partner_profile_card_header">
              <h3>관심사</h3>

              <span className="partner_profile_unlock">
                <img src={lock_icon} alt="" />
                1단계 해금
              </span>
            </div>

            <div className="partner_profile_tags">
              <span>#러닝</span>
              <span>#카페투어</span>
              <span>#전시회</span>
              <span>#보드게임</span>
            </div>
          </section>

          <section className="partner_profile_card partner_profile_card_active">
            <div className="partner_profile_card_header">
              <h3>취미 · MBTI</h3>

              <span className="partner_profile_unlock">
                <img src={lock_icon} alt="" />
                2단계 해금
              </span>
            </div>

            <div className="partner_profile_info_row">
              <span>취미</span>
              <strong>독서, 여행, 게임</strong>
            </div>

            <div className="partner_profile_info_row">
              <span>MBTI</span>
              <strong>INFJ</strong>
            </div>
          </section>

          <section className="partner_profile_locked">
            <div className="partner_profile_locked_header">
              <span>이름 · 학번 · 학과 · 프로필 사진</span>
              <img src={lock_icon} alt="" />
            </div>

            <div className="partner_profile_skeleton">
              <div />
              <div />
            </div>

            <p>
              3단계 ‘가까워지는 중’을 마치면 열려요
            </p>
          </section>
        </main>

        <button
          type="button"
          className="partner_profile_return"
          onClick={() => navigate('/chat/1')}
        >
          대화로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PartnerProfile;