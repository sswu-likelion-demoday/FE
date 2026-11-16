import { Route } from "react-router-dom";

import ChatList from "../pages/Chat/ChatList/ChatList";
import ChatRoom from "../pages/Chat/ChatRoom/ChatRoom";
import PartnerProfile from "../pages/Chat/Relationship/PartnerProfile/PartnerProfile";
import Relationship from "../pages/Chat/Relationship/Relationship";
import QuestQuiz from "../pages/Chat/Quest/QuestQuiz/QuestQuiz";
import QuestVerification from "../pages/Chat/Quest/QuestVerification/QuestVerification";

const ChatRoutes = (
  <>
    <Route path="/chat" element={<ChatList />} />
    <Route path="/chat/:chatId" element={<ChatRoom />} />
    <Route path="/chat/:chatId/profile" element={<PartnerProfile />} />
    <Route path="/chat/:chatId/relationship" element={<Relationship />} />
    <Route path="/chat/:chatId/quest/quiz" element={<QuestQuiz />} />
    <Route path="/chat/:chatId/quest/verification" element={<QuestVerification />} />
  </>
);

export default ChatRoutes;