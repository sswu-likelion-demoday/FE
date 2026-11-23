import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBlockedUsers, unblockUser } from "../../../../api/mypage";
import UnblockModal from "../../components/UnblockModal";
import MypageHeader from "../../components/MypageHeader";
import BlockedUserItem from "../../components/BlockedUserItem";
import "./BlockList.scss";
import info_icon from "../../../../assets/images/Mypage/info_icon.svg";
import check_icon from "../../../../assets/images/Mypage/check_icon.svg";

const BlockList = () => {
  const navigate = useNavigate();

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isUnblocking, setIsUnblocking] = useState(false);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) return;

      try {
        const data = await getBlockedUsers(accessToken);

        setBlockedUsers(
          data.blockedUsers.map((user) => ({
            id: user.userId,
            nickname: user.nickname,
            blockedDate: user.blockedAt.slice(0, 10).replaceAll("-", "."),
          })),
        );
      } catch (error) {
        console.error("차단 목록 조회 실패:", error);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleUnblock = async () => {
    if (!selectedUser || isUnblocking) return;

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setIsUnblocking(true);

      await unblockUser(selectedUser.id, accessToken);

      setBlockedUsers((prev) =>
        prev.filter((user) => user.id !== selectedUser.id),
      );

      setToastMessage(`${selectedUser.nickname}님의 차단을 해제했어요`);
      setSelectedUser(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUnblocking(false);
    }
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
