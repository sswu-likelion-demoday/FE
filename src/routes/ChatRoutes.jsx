import { Route } from 'react-router-dom';

import ChatList from '../pages/Chat/ChatList/ChatList';

import ChatSocketLayout from '../pages/Chat/ChatSocketLayout';

import ChatRoom from '../pages/Chat/ChatRoom/ChatRoom';

import PartnerProfile from '../pages/Chat/Relationship/PartnerProfile/PartnerProfile';

import Relationship from '../pages/Chat/Relationship/Relationship';

import QuestQuiz from '../pages/Chat/Quest/QuestQuiz/QuestQuiz';

import QuestVerification from '../pages/Chat/Quest/QuestVerification/QuestVerification';

const ChatRoutes = (
  <>
    <Route
      path="/chat"
      element={<ChatList />}
    />

    <Route
      path="/chat/:chatId"
      element={
        <ChatSocketLayout />
      }
    >
      <Route
        index
        element={<ChatRoom />}
      />

      <Route
        path="profile"
        element={
          <PartnerProfile />
        }
      />

      <Route
        path="relationship"
        element={
          <Relationship />
        }
      />

      <Route
        path="quest/quiz"
        element={
          <QuestQuiz />
        }
      />

      <Route
        path="quest/verification"
        element={
          <QuestVerification />
        }
      />
    </Route>
  </>
);

export default ChatRoutes;