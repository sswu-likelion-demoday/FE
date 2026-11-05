import { BrowserRouter, Routes } from "react-router-dom";
import OnboardingRoutes from "./routes/OnboardingRoutes";
import MypageRoutes from "./routes/MypageRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {OnboardingRoutes}
        {MypageRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
