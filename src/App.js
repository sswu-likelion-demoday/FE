import { BrowserRouter, Routes } from "react-router-dom";
import OnboardingRoutes from "./routes/OnboardingRoutes";
import MypageRoutes from "./routes/MypageRoutes";
import ChatRoutes from "./routes/ChatRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {OnboardingRoutes}
        {MypageRoutes}
        {ChatRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;