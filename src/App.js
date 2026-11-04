import { BrowserRouter, Routes } from "react-router-dom";
import OnboardingRoutes from "./routes/OnboardingRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>{OnboardingRoutes}</Routes>
    </BrowserRouter>
  );
}

export default App;
