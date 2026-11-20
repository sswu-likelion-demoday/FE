import { BrowserRouter, Routes } from "react-router-dom";
import OnboardingRoutes from "./routes/OnboardingRoutes";
import MypageRoutes from "./routes/MypageRoutes";
import ChatRoutes from "./routes/ChatRoutes";
import MatchingRoutes from "./routes/MatchingRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {OnboardingRoutes}
        {MypageRoutes}
        {ChatRoutes}
        {MatchingRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;