import "./MenuItem.scss";
import next_btn_2 from '../../../assets/images/Mypage/next_btn_2.svg'

const MenuItem = ({ icon, title, detail, onClick }) => {
  return (
    <button type="button" className="MenuItem_wrap" onClick={onClick}>
      <div className="menuitem_left">
        <div className="menuitem_icon">
          <img src={icon} alt="" />
        </div>
        <span>{title}</span>
      </div>

      <div className="menuitem_right">
        {detail && <span>{detail}</span>}
        <img src={next_btn_2} alt="" />
      </div>
    </button>
  );
};

export default MenuItem;
