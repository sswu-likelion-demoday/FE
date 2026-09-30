import { useState } from 'react';
import './BottomNav.scss';

import matching_icon from '../../assets/images/BottomNav/matching_icon.svg'
import matching2_icon from '../../assets/images/BottomNav/matching2_icon.svg'
import chat_icon from '../../assets/images/BottomNav/chat_icon.svg'
import chat2_icon from '../../assets/images/BottomNav/chat2_icon.svg'
import map_icon from '../../assets/images/BottomNav/map_icon.svg'
import map2_icon from '../../assets/images/BottomNav/map2_icon.svg'
import mypage_icon from '../../assets/images/BottomNav/mypage_icon.svg'
import mypage2_icon from '../../assets/images/BottomNav/mypage2_icon.svg'


const BottomNav = () => {

  const [activeMenu, setActiveMenu] = useState('');

  return (
    <div className="BottomNav_wrap">
      <div className={`bottomnav_box1 ${activeMenu === 'matching' ? 'active' : ''}`}
        onClick={() => setActiveMenu('matching')}>
        <img src={activeMenu === 'matching' ? matching2_icon : matching_icon}
          alt=""
          className="matching_icon" />
        <p>매칭</p>
      </div>

      <div className={`bottomnav_box2 ${activeMenu === 'chat' ? 'active' : ''}`}
        onClick={() => setActiveMenu('chat')}>
        <img src={activeMenu === 'chat' ? chat2_icon : chat_icon}
          alt=""
          className="chat_icon" />
        <p>채팅</p>
      </div>

      <div className={`bottomnav_box3 ${activeMenu === 'map' ? 'active' : ''}`}
        onClick={() => setActiveMenu('map')}>
        <img src={activeMenu === 'map' ? map2_icon : map_icon}
          alt=""
          className="map_icon" />
        <p>수정맵</p>
      </div>

      <div className={`bottomnav_box4 ${activeMenu === 'mypage' ? 'active' : ''}`}
        onClick={() => setActiveMenu('mypage')}>
        <img src={activeMenu === 'mypage' ? mypage2_icon : mypage_icon}
          alt=""
          className="mypage_icon" />
        <p>마이</p>
      </div>
    </div>
  )
}

export default BottomNav
