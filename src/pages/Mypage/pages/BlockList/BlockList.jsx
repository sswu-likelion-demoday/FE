import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UnblockModal from "../../components/UnblockModal";
import MypageHeader from "../../components/MypageHeader";
import BlockedUserItem from "../../components/BlockedUserItem";
import "./BlockList.scss";
import info_icon from "../../../../assets/images/Mypage/info_icon.svg";
import check_icon from "../../../../assets/images/Mypage/check_icon.svg";

const BlockList = () => {
  const navigate = useNavigate();

  const [blockedUsers, setBlockedUsers] = useState([
    {
      id: 1,
      nickname: "달빛여우",
      blockedDate: "2026.09.24",
    },
    {
      id: 2,
      nickname: "새벽산책",
      blockedDate: "2026.09.18",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const handleUnblock = () => {
    if (!selectedUser) return;

    setBlockedUsers((prev) =>
      prev.filter((user) => user.id !== selectedUser.id),
    );

    setToastMessage(`${selectedUser.nickname}님의 차단을 해제했어요`);
    setSelectedUser(null);
  };

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="page BlockList_wrap">
      <div className="blocklist_top">
        <MypageHeader title="차단 목록" onBack={() => navigate("/mypage")} />
      </div>

      <div className="blocklist_main">
        <div className="blocklist_notice">
          <img src={info_icon} alt="" />
          <p>
            차단한 사용자는 매칭과 채팅에서 보이지 않아요.
            <br />
            해제하면 다시 매칭될 수 있어요.
          </p>
        </div>

        <div className="blocklist_count">
          차단한 사용자 {blockedUsers.length}
        </div>

        <div className="blocklist_box">
          {blockedUsers.map((user) => (
            <BlockedUserItem
              key={user.id}
              nickname={user.nickname}
              blockedDate={user.blockedDate}
              onUnblock={() => setSelectedUser(user)}
            />
          ))}
        </div>
      </div>

      {selectedUser && (
        <UnblockModal
          onCancel={() => setSelectedUser(null)}
          onConfirm={handleUnblock}
        />
      )}

      {toastMessage && (
        <div className="blocklist_toast" role="status">
          <img src={check_icon} alt="" />
          <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default BlockList;
