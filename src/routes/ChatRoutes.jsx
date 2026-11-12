import { Route } from "react-router-dom";

import ChatList from "../pages/Chat/ChatList/ChatList";
import ChatRoom from "../pages/Chat/ChatRoom/ChatRoom";
import PartnerProfile from "../pages/Chat/Relationship/PartnerProfile/PartnerProfile";

const ChatRoutes = (
  <>
    <Route path="/chat" element={<ChatList />} />
    <Route path="/chat/:chatId" element={<ChatRoom />} />
    <Route path="/chat/:chatId/profile" element={<PartnerProfile />} />
  </>
);

export default ChatRoutes;